// pages/mineFile/shop/componentOrder/shopOrder.js
let mallApi = require('../../../../common/newService/mallService.js');
let qbPayment = require('../../../../common/newService/payment.js');
let app = getApp();
Page({


  /**
   * 组件的初始数据
   */
  data: {
    urlPrefix: app.urlWWW,
    topToolBarItems: [{
      key: 3,
      text: '全部',
      isSelected: true
    }, {
      key: 0,
      text: '待付款',
      isSelected: false
    }, {
      key: 1,
      text: '待收货',
      isSelected: false,
    }, {
      key: 2,
      text: '已完成',
      isSelected: false
    },{
      key: 4,
      text: '已取消',
      isSelected: false
    }],
    order_data: []
  },

  ready: function () {
    let res = wx.getSystemInfoSync();
    this.setData({
      scrollViewHeight: res.windowHeight - 44 - 49
    })
    const self = this;
    getData(self);
  },

  methods: {
    topToolBarEvent: function (e) {
      const _key = e.currentTarget.dataset.key;
      var _topToolBarItems = this.data.topToolBarItems;
      _topToolBarItems.forEach(v => {
        if (v.key == _key) {
          v.isSelected = true;
        } else {
          v.isSelected = false;
        }
      });
      var orderData = this.data.order_data;
      orderData.forEach(v => {
        if (_key == 3) {
          v.isShow = true;
        } else if (v.orderStatus == _key) {
          v.isShow = true
        } else {
          v.isShow = false;
        }
      })
      this.setData({
        topToolBarItems: _topToolBarItems,
        order_data: orderData
      })
    },

    statusButtonEvent: function (e) {

      const details = e.currentTarget.dataset.event.split('_');
      const id = details[1];
      const self = this;
      switch (details[0]) {
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
          break;
        default:
          break;
      }
    }
  }
})
function getData(self) {

  mallApi.getOrderList(function (res) {
    if (res.data.status == 1) {
      var orderData = res.data.order_data;
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
            default: break;
          }
        } else if (v.order_status == '1' || v.order_status == '2') { // 订单已完成 / 成功订单
          v.orderStatus = '2';
          v.orderStatusString = '已完成';
        } else if (v.order_status == '3') { // 订单关闭
          v.orderStatus = '2';
          v.orderStatusString = '已取消'
        }
        v.isShow = true;
      })
      self.setData({
        order_data: orderData
      })
    }
  }, function (err) {
    console.log(err);
  })
}

// 取消订单
function cancePendingPaymentOrder(orderId, self) {
  mallApi.cancePendingPaymentOrder(orderId, function (res) {
    if (res.data.status == 1) {
      const orderData = self.data.order_data;
      var _index;
      orderData.forEach((v) => {
        if (v.order_id == orderId) {
          v.orderStatus = '2';
          v.orderStatusString = '已取消'
        }
      });
      self.setData({
        order_data: orderData
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '网络出错',
      })
    }
  }, function (err) {
    wx.showToast({
      icon: 'none',
      title: '网络出错',
    })
  })
}

// 删除订单
function delegateOrder(orderId, self) {

  mallApi.delegateOrder(orderId, function (res) {
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
  }, function (err) {
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
  qbPayment.order(orderId, function (res) {

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
      success: function (res) {
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
      }, fail: function (err) {
        wx.hideLoading();
        if (err.errMsg == "requestPayment:fail cancel") {
          wx.redirectTo({
            url: '../paymentStatus/paymentStatus?status=0',
          })
        }
      }
    })
  }, function (err) {
    wx.hideLoading();
    console.log(err);
  })
}
