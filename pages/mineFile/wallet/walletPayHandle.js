var mallService = require('../../../common/serviceAPI/mallServiceApi');
var userService = require('../../../common/serviceAPI/userServiceApi');
var walletService = require('../../../common/serviceAPI/walletServiceApi');

var OrderType = { "deposit": "6", "recharge": "10", "shopping": "11" };

/**
 * 获取OpenId
 * orderType
 */
function getOpenId(orderId, orderType, success, fail) {

    // 2、获取openid
    userService.getOpenId(function (res) {
        var openId = res.data.openid;
        // 3、统一下单
        mallService.unifyOrder(orderId, openId, function (res) {

            if (res.data.return == "0") {
                console.log(res.data.msg);
                return;
            }
            if (res.data.return == "1") {
                // 4、支付
                wx.requestPayment({
                    timeStamp: res.data.timeStamp.toString(),
                    nonceStr: res.data.nonceStr,
                    package: res.data.package,
                    signType: 'MD5',
                    paySign: res.data.paySign,
                    success: function (res) {

                        if (res.errMsg == 'requestPayment:ok') {
                          success();
                        } else {
                          fail();
                        }
                    },
                    fail: function (err) {

                        wx.showModal({
                            title: '支付失败',
                            content: '用户取消支付',
                            showCancel: false,
                            success: function (res) {
                                                       
                            }
                        })                        
                    }
                })
            }
        }, function (err) {
            fail();
        })
    }, function (err) {
        fail();
    })
}

/**
 * orderType: 订单类型 1 商品  2 疗程 6 共享设备押金 10充值
 * 在这个接口，处理6和10
 * money： 金额
 */
function payOrder(money, orderType, success, fail) {

    // 1、创建充值/交押金订单
    walletService.createRecharge(money, orderType, function (res) {
        var orderId = res.data.armariumScId;
        getOpenId(orderId, orderType,  function (res) {
            success(res);
        }, function (err) {
            fail(err);
        });
    }, function (err) {
        console.log('提交订单失败');
        console.log(err);
    })
}

function refundDeposit(success) {

    // 取最新押金订单
    walletService.getRecharge({
        armariumScLeixing: "6",
        armariumScFukuanZt: "1",
        armarium_begin: '0',
        armarium_records: '1',
    }, function (res) {

        var scId = res.data.data[0].armariumScId;
        walletService.refundDeposit({
            armariumScId: scId
        }, function (res) {
            
            if (res.data.return == "1") {
                success({ "msg": "refundDeposit:ok" });
                
            } else {
                success({ "msg": "refundDeposit:fail"});
            }
        }, function (err) {
            console.log(err);
        })
    }, function (err) {
        console.log(err);
    })
}


module.exports = {
    OrderType: OrderType,
    getOpenId: getOpenId,
    payOrder: payOrder,
    refundDeposit: refundDeposit
}