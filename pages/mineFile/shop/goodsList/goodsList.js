// pages/mineFile/shop/goodsList/goodsList.js
var mallBanner = require('../componentHome/mallBanner');
var getGoodsTypeLabel = require('mallGoodsTypeLabel'); 
var mallGoods = require('../componentHome/mallGoods');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlWWW: '',
    currentTab: 0,
    navScrollLeft: 0
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var id = options.id;
    getGoodsTypeLabel.initGoodsTypeLabel(id,self);
    mallBanner.initBanner(self);
    mallGoods.initTypeGoods(id,self);
    this.setData({
      urlWWW: app.urlWWW
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
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  switchTab(event) {
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
  },
  goodsItemEvent: function (e) {
    wx.navigateTo({
      url: '../commodity/commodity?commodityId=' + e.currentTarget.dataset.id,
    })
  },
})