// order.js
var app = getApp();
var mallApi = require('../../../../common/newService/mallService');
var qbPayment = require('../../../../common/newService/payment.js');

var invoice = new Object();
invoice.title = "";
invoice.address = "";
invoice.isNeed = "1";
var userAddress = null;

var order;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.order = JSON.parse(options.data);
    this.orderType = options.orderType;
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          containerViewHeight: res.screenHeight - 64 - 60 - 100 
        })
      }
    })
    this.initData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initAddress();
  },

  initAddress() {
    const v = wx.getStorageSync("userMailAddress");
    if (typeof v == "object") {
      this.address = v;
    }
    this.setData({
      userAddress: this.address ? this.address.mail_address : "请添加收货地址信息",
      addressName: this.address ? this.address.name : "",
      addressMobile: this.address ? this.address.mobile : ""
    })
  },

  initData() {

    var goodsList = this.order.goods_list;
    this.isNeedPost = false;

    var goodsListUI = [];
    var type = goodsList.every((v,index) => {
      return v.goods_type == '0'
    })
    if(type){
      this.setData({
        index: 0
      })
    }else{
      this.setData({
        index: 1
      })
    }
    goodsList.forEach((v, index) => {
      if (v.goods_type == "1") { 
        this.isNeedPost = true;
      }
      let item = {
        orderGoodsIndex: index,
        data: {
          productImageSrc: v.goods_img_url,
          productTitle: v.goods_name,
          productSubtitle: v.spec_name ? v.spec_name : "",
          productPrice: v.goods_price,
          productCount: v.goods_num
        }
      }
      goodsListUI.push(item);
    })
    var user_money = this.order.user_money;
    var userBalance = Number(user_money) ? Number(user_money).toFixed(2) : 0;
    this.setData({
      isNeedPost: this.isNeedPost,
      orderGoods: goodsListUI,
      userBalance: userBalance,
      userIntegral: this.order.user_points,
      orderIntegral: this.order.order_points,
      balanceChecked: false,
      integralChecked: false,
      totalPrice: this.order.order_total,
    })
  },

  paymentAction() {

    if (typeof this.address != 'object' && this.isNeedPost == true) {
      wx.showToast({
        icon: "none",
        title: '请填写地址',
      })
      return;
    }
    wx.showLoading({
      title: '',
      mask: true
    })
    var data = new Object();
    data.use_points_status = this.isIntegralCheck ? 1 : 0;
    data.use_money_status = this.isBalanceCheck ? 1 : 0;
    data.submit_type = this.orderType;
    if (this.isNeedPost) {
      data.mail_address_id = this.address.id;
    }
    var self = this;
    mallApi.createOrder(data, function (res) {

      if (res.data.status == 1) {
        switch (res.data.payment_status + "") {
          case "1":
            wx.hideLoading();
            wx.redirectTo({
              url: '../paymentStatus/paymentStatus?status=1' + '&index=' + self.data.index,
            })
            break;
          case "2":
            self.requestWXPayment(res.data.order_id);
            break;
          default:
            break;
        }
      } else {
        wx.hideLoading();
        wx.redirectTo({
          url: '../paymentStatus/paymentStatus?status=0',
        })
      }
    }, function (err) {
      wx.showToast({
        title: '网络出错',
      })
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
    
    this.setData({
      totalPrice: (this.order.order_total - integral/10) < 0 ? 0 : this.order.order_total - integral/10
    })
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
    const self = this;
    qbPayment.order(orderId, function (res) {

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
        success: function (res) {
        wx.hideLoading();
          if (res.errMsg == 'requestPayment:ok') {
            wx.redirectTo({
              url: '../paymentStatus/paymentStatus?status=1'+ '&index=' + self.data.index,
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
    }, function (err) { console.log(err); })
  }
})