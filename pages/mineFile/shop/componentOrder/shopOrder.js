// pages/mineFile/shop/componentOrder/shopOrder.js
let mallApi = require('../../../../common/newService/mallService.js');
let qbPayment = require('../../../../common/newService/payment.js');
let app = getApp();

import templete from "../../../../components/tabBar/tabBar.js";
Page({

    /**
     * 组件的初始数据
     */
    data: {
        urlPrefix: app.urlWWW,
        topToolBarItems: [{
            key: 0,
            text: '待支付',
            isSelected: true,
        }, {
            key: 1,
            text: '待发货',
            isSelected: false,
        }, {
            key: 2,
            text: '待收货',
            isSelected: false,
        }, {
            key: 3,
            text: '已完成',
            isSelected: false,
        }, {
            key: 4,
            text: '退货',
            isSelected: false,
        }],
        isNoData: true,
        index: 0

    },
    onLoad: function(options) {
        const self = this;
        let res = wx.getSystemInfoSync();
        this.setData({
            scrollViewHeight: res.windowHeight - 44 - 49
        })
        var key = options.key || 0;
        self.setData({
            key:key
        })
    },
    onShow() {
        var self = this;
        var key = self.data.key;
        self.getData(key);
        templete.tabbar("tabBar", 2, this) //0表示第一个tabbar
        if (key !== 0) {
            var _topToolBarItems = this.data.topToolBarItems;
            _topToolBarItems.forEach(v => {
                if (v.key == key) {
                    v.isSelected = true;
                } else {
                    v.isSelected = false;
                }
            });
            this.setData({
                topToolBarItems: _topToolBarItems
            })
        }

    },

    ready: function() {

    },

    topToolBarEvent: function(e) {
        const self = this;
        const _key = e.currentTarget.dataset.key;
        var _topToolBarItems = this.data.topToolBarItems;
        _topToolBarItems.forEach(v => {
            if (v.key == _key) {
                v.isSelected = true;
            } else {
                v.isSelected = false;
            }
        });
        wx.showLoading();
        mallApi.getOrderList({ key: _key }, function(res) {
                wx.hideLoading();
                var orderData = res.data.order_data;
                if (res.data.status == 1) {
                    if (!orderData || orderData.length < 1) {
                        self.setData({
                            isNoData: false,
                            order_data: [],
                            index: _key,
                            topToolBarItems: _topToolBarItems
                        })
                        return;
                    }
                    if (_key == 4) {
                        orderData.forEach(function(i, index) {
                            var goods_list = i.goods_list;
                            var returnAllPrice = 0;
                            if (goods_list) {
                                goods_list.forEach(function(t, index) {
                                    if (t.return_status == 1) {
                                        returnAllPrice += t.goods_price * t.return_goods_num
                                    } else {
                                        returnAllPrice += t.goods_price * t.processing_num
                                    }
                                })
                            }
                            i.returnAllPrice = returnAllPrice;
                        })
                    }
                    // orderData.forEach(v => {
                    //     if (v.order_status == '0') { // 订单未完成，判断支付状态
                    //         switch (v.pay_status) {
                    //             case '0': // 未支付
                    //                 v.orderStatus = '0';
                    //                 v.orderStatusString = "待付款";
                    //                 break;
                    //             case '1': // 已支付
                    //                 v.orderStatus = '1';
                    //                 v.orderStatusString = "待收货";
                    //                 break;
                    //             case '2': // 已退款
                    //                 v.orderStatus = '2';
                    //                 v.orderStatusString = "已退款";
                    //                 break;
                    //             case '3': // 部分退款
                    //                 v.orderStatus = '2';
                    //                 v.orderStatusString = "部分退款";
                    //                 break;
                    //             default:
                    //                 break;
                    //         }
                    //     } else if (v.order_status == '1' || v.order_status == '2') { // 订单已完成 / 成功订单
                    //         v.orderStatus = '2';
                    //         v.orderStatusString = '已完成';
                    //     } else if (v.order_status == '3') { // 订单关闭
                    //         v.orderStatus = '2';
                    //         v.orderStatusString = '已取消'
                    //     }
                    // })
                    self.setData({
                        order_data: orderData,
                        isNoData: true,
                        index: _key,
                        topToolBarItems: _topToolBarItems
                    })
                } else {
                    self.setData({
                        isNoData: false,
                        order_data: [],
                        index: _key,
                        topToolBarItems: _topToolBarItems
                    })
                }

            },
            function(err) {

            })
    },
    gotoPayDetails(order_id,index){
        wx.navigateTo({
            url: '../orderDetail/payDetail/payDetail?order_id=' + order_id + "&index=" + index,
        })
    },
    gotoSendDetails(order_id,index){
        wx.navigateTo({
            url: '../orderDetail/sendDetail/sendDetail?order_id=' + order_id + "&index=" + index,
        })
    },
    gotoReceiveDetails(order_id,index){
        wx.navigateTo({
            url: '../orderDetail/receiveDetail/receiveDetail?order_id=' + order_id + "&index=" + index,
        })
    },
    gotoCompleteDetails(order_id,index){
        wx.navigateTo({
            url: '../orderDetail/completeDetail/completeDetail?order_id=' + order_id + "&index=" + index,
        })
    },
    statusButtonEvent: function(e) {

        const details = e.currentTarget.dataset.event.split('_');
        const index = e.currentTarget.dataset.index;
        const id = details[1];
        const self = this;
        switch (details[0]) {
            case 'payDetails':
                self.gotoPayDetails(id,index);
                break;
            case 'sendDetails':
                self.gotoSendDetails(id,index);
                break;
            case 'receiveDetails':
                self.gotoReceiveDetails(id,index);
                break;
            case 'completeDetails':
                self.gotoCompleteDetails(id,index);
                break;
            case 'canceOrder':
                cancePendingPaymentOrder(id, self);
                break;
            case 'payment':
                paymentEvent(id);
                break;
            case 'evaluation':
                break;
            case 'buyAgain':
                paymentEvent(id);
                break;
            case 'delegateOrder':
                delegateOrder(id, self);
                break;
            case 'orderDetails':
                self.gotoDetail(id, index)
                break;
            case 'returnOrder':
                self.returnGoods(id)
                break;
            case 'detail':
                var courier_sn = e.currentTarget.dataset.courier_sn;
                var courier_name = e.currentTarget.dataset.courier_name;
                self.goDetail({
                    shipper_code: courier_name,
                    logistic_code: courier_sn
                })
            default:
                break;
        }
    },
    getData(key) {
        const self = this;
        wx.showLoading();
        mallApi.getOrderList({ key: key }, function(res) {
            wx.hideLoading();
            if (res.data.status == 1) {
                console.log(res)
                var orderData = res.data.order_data;
                if (!orderData || orderData.length < 1) {
                    self.setData({
                        isNoData: false,
                        order_data: [],
                        index: key
                    })
                    return;
                }
                if (key == 4) {
                    orderData.forEach(function(i, index) {
                        var goods_list = i.goods_list;
                        var returnAllPrice = 0;
                        if (goods_list) {
                            goods_list.forEach(function(t, index) {
                                if (t.return_status == 1) {
                                    returnAllPrice += t.goods_price * t.return_goods_num
                                } else {
                                    returnAllPrice += t.goods_price * t.processing_num
                                }
                            })
                        }
                        i.returnAllPrice = returnAllPrice;
                    })
                }
                orderData.forEach(v => {
                    if (v.order_status == '0') { // 订单未完成，判断支付状态
                        switch (v.pay_status) {
                            case '0': // 未支付
                                v.orderStatus = '0';
                                v.orderStatusString = "待付款";
                                break;
                            case '1': // 已支付
                                v.orderStatus = '1';
                                v.orderStatusString = "待收货";
                                break;
                            case '2': // 已退款
                                v.orderStatus = '2';
                                v.orderStatusString = "已退款";
                                break;
                            case '3': // 部分退款
                                v.orderStatus = '2';
                                v.orderStatusString = "部分退款";
                                break;
                            default:
                                break;
                        }
                    } else if (v.order_status == '1' || v.order_status == '2') { // 订单已完成 / 成功订单
                        v.orderStatus = '2';
                        v.orderStatusString = '已完成';
                    } else if (v.order_status == '3') { // 订单关闭
                        v.orderStatus = '2';
                        v.orderStatusString = '已取消'
                    }
                })
                self.setData({
                    order_data: orderData,
                    index: key
                })
            } else {
                self.setData({
                    isNoData: false,
                    order_data: [],
                    index: key
                })
            }
        }, function(err) {
            console.log(err);
        })
    },
    //跳转订单详情
    gotoDetail: function(order_id, index) {
        wx.navigateTo({
            url: '../orderDetail/orderDetail?order_id=' + order_id + "&index=" + index,
        })

    },
    //退货页面
    returnGoods: function(order_id) {
        wx.navigateTo({
            url: '../returnGoods/returnGoods?order_id=' + order_id
        })
    },
    //查看物流详情
    goDetail: function(data) {
        var shipper_code = data.shipper_code;
        var logistic_code = data.logistic_code;
        wx.navigateTo({
            url: '../logisticsDetails/logisticsDetails?shipper_code=' + shipper_code + '&logistic_code=' + logistic_code
        })
    }
})


// 取消订单
function cancePendingPaymentOrder(orderId, self) {
    wx.showModal({
        title: '取消订单？',
        content: "您确定取消吗？",
        success: function(res) {
            if (res.confirm) {
                mallApi.cancePendingPaymentOrder(orderId, function(res) {
                    if (res.data.status == 1) {
                        wx.showToast({
                            title: "取消成功",
                            icon: "none"
                        })
                        self.getData();

                    } else {
                        wx.showToast({
                            icon: 'none',
                            title: '网络出错',
                        })
                    }
                }, function(err) {
                    wx.showToast({
                        icon: 'none',
                        title: '网络出错',
                    })
                })
            }
        }

    })
}

// 删除订单
function delegateOrder(orderId, self) {

    mallApi.delegateOrder(orderId, function(res) {
        if (res.data.status == 1) {
            const orderData = self.data.order_data;
            var _index;
            orderData.forEach((v, index) => {
                if (v.order_id == orderId) {
                    _index = index;
                }
            });
            orderData.splice(_index, 1);
            self.setData({
                order_data: orderData
            })
        } else {
            wx.showToast({
                icon: 'none',
                title: '网络出错',
            })
        }
    }, function(err) {
        wx.showToast({
            icon: 'none',
            title: '网络出错',
        })
    })
}

function paymentEvent(orderId) {

    wx.showLoading({
        title: '',
        mask: true
    })
    qbPayment.order(orderId, function(res) {

        if (res.data.status != 1) {
            wx.showToast({
                title: res.data.msg,
            })
            wx.hideLoading();
            return
        }
        let jsApiParameters = JSON.parse(res.data.jsApiParameters);

        wx.requestPayment({
            timeStamp: jsApiParameters.timeStamp.toString(),
            nonceStr: jsApiParameters.nonceStr,
            package: jsApiParameters.package,
            signType: jsApiParameters.signType,
            paySign: jsApiParameters.paySign,
            success: function(res) {
                wx.hideLoading();
                if (res.errMsg == 'requestPayment:ok') {
                    wx.redirectTo({
                        url: '../paymentStatus/paymentStatus?status=1',
                    })
                } else {
                    wx.redirectTo({
                        url: '../paymentStatus/paymentStatus?status=0',
                    })
                }
            },
            fail: function(err) {
                wx.hideLoading();
                if (err.errMsg == "requestPayment:fail cancel") {
                    wx.redirectTo({
                        url: '../paymentStatus/paymentStatus?status=0',
                    })
                }
            }
        })
    }, function(err) {
        wx.hideLoading();
        console.log(err);
    })
}