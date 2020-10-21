// pages/merchants/payment/payment.js
import getAjax from '../../../common/getAjax.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    profit: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var store_id = wx.getStorageSync('user').store_id;
    getAjax.getPost("/Weixin/Store/storeProfit", { store_id: store_id})
    .then((res)=> {
  this.setData({
    profit: res.data.money
  })
    })
    .catch((err) => {

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
  
  },
  getPay(){
    wx.showToast({
      title: '提现功能开发中...',
      icon: 'none'
    })
  }
})