// pages/homeFile/products/products.js
var otherService = require('../../common/newService/otherService.js');
var userId;
var scene;
var app = getApp();
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
    scene = options.scene;
    if (scene == undefined) {
      return
    }
    userId = scene.split("_")[0].split(':')[1];
    var self = this;
    wx.showLoading({
      title: '',
    })
    otherService.getProductImageUrl(function (res) {
      wx.hideLoading();
      if (res.data.status == 1) {
        self.setData({
          imageSrc: app.urlWWW + res.data.productintroduction_url
        })
      }
    }, function (err) {
      wx.hideLoading();
    })


    if (userId != undefined) {
      otherService.getUserQRCodeWithUserId(userId, function (res) {
        console.debug(res);
        if (res.data.status == 1) {
          self.setData({
            qrCodeImageSrc: app.urlWWW + res.data.qrcode
          })
        }
      }, function (res) { })
    }
    
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
    
      if (scene != undefined) {
        return {
          path: '/pages/shareFile/productShare? scene =' + scene
        }
      }
  },

  bindlongtapEvent() {
    
    if (scene != undefined) {
      wx.navigateTo({
        url: '../register/register?scene=' + scene
      })
    }
  }
})