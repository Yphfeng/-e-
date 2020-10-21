// pages/homeFile/products/products.js
var otherService = require('../../../common/newService/otherService.js');
var mineService = require('../../../common/newService/mineService.js');
var app = getApp();
var isShare = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageWidth: app.screenWidth,
    imageHeight: 10000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this;
    wx.showLoading({ title: '' });
    otherService.getProductImageUrl(function (res) {
      wx.hideLoading();
      if (res.data.status == 1) {
        self.setData({
          imageSrc: app.urlWWW + res.data.productintroduction_url
        })
      }
    }, function (err) {
      console.debug(err);
      wx.hideLoading();
    })

    mineService.getUserQRCode(function (res) {
      if (res.data.status == 1) {
        isShare = true
      }
    })
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    if (isShare) {
      const scene = 'userId:' + app.getUser().user_id + '_userType:' + app.getUser().user_type;
      return {
        path: '/pages/shareFile/productShare?scene=' + scene
      }
    }
  }
})