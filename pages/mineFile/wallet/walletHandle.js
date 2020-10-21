
var payHandle = require("walletPayHandle");
var deviceService = require('../../../common/serviceAPI/deviceServiceApi');
var treatmentService = require('../../../common/serviceAPI/treatmentServiceApi');
var mineService = require('../../../common/newService/mineService');
var courseService = require('../../../common/newService/courseService');
var newMallService = require('../../../common/newService/mallService');
var user = new Object();
var money = 0.00;

// 初始化金额
function initMoney(self) {

  mineService.getUserBalance(function (res) {
    if (res.data.status == 0) {
      self.setData({
        userMoney: res.data.money
      })
    }
  }, function (err) {

  })
}

// 充值
function recharge(money) {
  // 支付
  payHandle.payOrder(money, payHandle.OrderType.recharge, function (res) {
    wx.navigateBack({})
  }, function (err) {
    wx.navigateBack({})
  });
}

// 退押金
function refundDeposit(self) {

  payHandle.refundDeposit(function (res) {

    if (res.msg == "refundDeposit:ok") {
      wx.showModal({
        title: '退款成功',
        content: '请在微信钱包查看',
        success: function (res) {
          // 重新加载界面
          initMoney(self);
        }
      })
    } else {
      wx.showModal({
        title: '退款失败',
        content: '请联系客服人员',
      })
    }
  });
}

  

module.exports = {
  initMoney: initMoney,
  recharge: recharge
}