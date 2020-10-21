// wallet.js
var mineService = require('../../../common/newService/mineService');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMoney: '0.00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function (options) {

    var self = this;

    mineService.getUserBalance(function (res) {
      if (res.data.status == 1) {
        self.setData({
          userMoney: parseFloat(res.data.money).toFixed(2)
        })
      }
    }, function (err) { })
  },

  onReachBottom: function () {

  },


  reflectedAction() {

    wx.navigateTo({
      url: 'refund?userMoney=' + this.data.userMoney,
    })
  },

  gotoMallAction: function () {
    wx.redirectTo({
      url: '../shop/mall/mall',
    })
  }
})