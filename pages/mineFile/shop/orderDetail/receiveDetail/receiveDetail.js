// order.js
var app = getApp();
var mallApi = require('../../../../../common/newService/mallService');
var qbPayment = require('../../../../../common/newService/payment.js');
import mineService from '../../../../../common/newService/mineService.js';


Page({

    /**
     * 页面的初始数据
     */
    data: {
        isAdress: true

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        const order_id = options.order_id;
        const index = options.index;
        this.setData({
            order_id: order_id,
            urlPrefix: app.urlPrefix,
            index: index
        })
        var self = this;
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    containerViewHeight1: res.screenHeight,
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.initData();
    },


    initData() {

        const self = this;
        mallApi.getUserDeliveredOrderDetail({ order_id: this.data.order_id }, function(res) {
            if (res.data.status == 1) {
                var order_list = res.data.order_data[0];
                if(order_list.order_type == 1) {
                    self.setData({
                        containerViewHeight: self.data.containerViewHeight1 - 100 - 120
                    })
                    
                }else{
                    self.setData({
                        containerViewHeight: self.data.containerViewHeight1 - 50
                    })
                    
                }

                var goods_list = res.data.order_data[0].goods_list;
                var isXni = goods_list.every(function(v, index, arr) {
                    return v.goods_type == '0'
                })
                console.log(isXni)
                self.setData({
                    isXuni: isXni
                })
                goods_list.forEach(function(i, index) {
                    if (i.goods_type == '0') {
                        self.setData({
                            isAdress: false,
                        })
                        return;
                    }
                    self.setData({
                        isAdress: true
                    })
                })
                if (res.data.order_data[0].shipping_address) {
                    var address = res.data.order_data[0].shipping_address[0];
                } else {
                    var address = '';
                }
                self.setData({
                    goodData: res.data.order_data,
                    goodsList: res.data.order_data[0].goods_list[0],
                    address: address
                })
            } else {
                self.setData({
                    goodData: [],
                    goodsList: [],
                    address: ''
                })
            }
        }, function(err) {
            console.log(err)
        })
    },

    checkboxChange(e) {

        const self = this;
        if (e.detail.value.length == 0) {

            this.isBalanceCheck = false;
            this.isIntegralCheck = false;
        } else if (e.detail.value.length == 2) {
            this.isBalanceCheck = true;
            this.isIntegralCheck = true;
        } else {
            e.detail.value.forEach(v => {
                if (v == 'balance') {
                    this.isBalanceCheck = true;
                    this.isIntegralCheck = false;
                }
                if (v == 'integral') {
                    this.isBalanceCheck = false;
                    this.isIntegralCheck = true;
                }
            })
        }

        var integral = 0;
        if (this.isIntegralCheck) {
            if (this.order.user_points > this.order.order_points) {
                integral = this.order.order_points;
            } else if (this.order.user_points <= this.order.order_points) {
                integral = this.order.user_points;
            }
        }
    },

    invoiceInput(e) {
        switch (e.currentTarget.dataset.invoiceinput) {
            case "address":
                invoice.address = e.detail.value;
                break;
            case "title":
                invoice.title = e.detail.value;
                break;
            default:
                break;
        }
    },

    radioValueChange(e) {

        var isType = true;
        switch (e.detail.value) {
            case '不需要':
                isType = true;
                invoice.isNeed = "0";
                break;
            case '需要':
                isType = false;
                invoice.isNeed = "1";
                break;
            default:
                break;
        }
        this.setData({
            isInputDisabled: isType
        })
    },

    requestWXPayment(orderId) {

        qbPayment.order(orderId, function(res) {

            if (res.data.status != 1) {
                wx.showToast({
                    title: res.data.msg,
                })
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
                            url: '../../paymentStatus/paymentStatus?status=1',
                        })
                    }
                },
                fail: function(err) {
                    wx.hideLoading();
                    if (err.errMsg == "requestPayment:fail cancel") {
                        wx.redirectTo({
                            url: '../../paymentStatus/paymentStatus?status=0',
                        })
                    }
                }
            })
        }, function(err) { console.log(err); })
    },
    returnGoods: function(e) {
        var index = e.currentTarget.dataset.index;
        var id = e.currentTarget.dataset.id;
        if (index == 1) {
            wx.navigateTo({
                url: '../../returnGoods/returnGoods?index=1&id=' + id
            })
        } else {
            wx.navigateTo({
                url: '../../returnGoods/returnGoods?index=2&id=' + id
            })
        }
    },
//跳转订单详情
gotoDetail: function(order_id) {
    wx.navigateTo({
        url: '../../orderDetail/orderDetail?order_id=' + order_id,
    })

},
//退订单页面
returnOrder: function(order_id) {
    wx.showModal({
        content: '您确定退货吗？',
        success: function(res) {
            if (res.confirm) {
                mallApi.returnOrderForReturn({ order_id: order_id }, function(response) {
                    if (response.data.status == 1) {
                        wx.showToast({
                            title: "申请成功",
                            icon: 'none'
                        })
                        setTimeout(function() {
                            wx.redirectTo({
                                url: '../../componentOrder/shopOrder?key=4'
                            })
                        }, 1500)

                    }
                })
            }
        }
    })
},
//查看物流详情
goDetail: function(data) {
    var shipper_code = data.shipper_code;
    var logistic_code = data.logistic_code;
    wx.navigateTo({
        url: '../../logisticsDetails/logisticsDetails?shipper_code=' + shipper_code + '&logistic_code=' + logistic_code
    })
},
//确认收货
confirmOrder: function(order_id){
    wx.showModal({
        content: '您确定收货吗？',
        success: function(res) {
            mallApi.confirmReceipt({order_id: order_id},function(response){
                if(response.data.status == 1) {
                    wx.redirectTo({
                        url: '../../componentOrder/shopOrder?key=3'
                    })
                }
            })
        }
    })
},
statusButtonEvent: function(e) {
    var id = this.data.order_id;

    const details = e.currentTarget.dataset.event;
    const self = this;
    switch (details) {
        case 'canceOrder':
            cancePendingPaymentOrder(id, self);
            break;
        case 'payment':
            self.paymentEvent(id);
            break;
        case 'evaluation':
            break;
        case 'buyAgain':
            self.paymentEvent(id);
            break;
        case 'delegateOrder':
            delegateOrder(id, self);
            break;
        case 'orderDetails':
            self.gotoDetail(id)
            break;
        case 'returnGoods':
            self.returnGoods(id);
            break;
        case 'returnOrder':
            self.returnOrder(id)
            break;
        case 'confirmOrder':
        self.confirmOrder(id)
        default:
            break;
    }
},
//去付款
paymentEvent(orderId) {
    const self = this;
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
                    if (self.data.isXuni) {
                        console.log(self.data.isXuni)
                        wx.redirectTo({
                            url: '../../paymentStatus/paymentStatus?status=1&index=0',
                        })
                    } else {
                        wx.redirectTo({
                            url: '../../paymentStatus/paymentStatus?status=1&index=1',
                        })
                    }

                } else {
                    wx.redirectTo({
                        url: '../../paymentStatus/paymentStatus?status=0',
                    })
                }
            },
            fail: function(err) {
                wx.hideLoading();
                if (err.errMsg == "requestPayment:fail cancel") {
                    wx.redirectTo({
                        url: '../../paymentStatus/paymentStatus?status=0',
                    })
                }
            }
        })
    }, function(err) {
        wx.hideLoading();
        console.log(err);
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