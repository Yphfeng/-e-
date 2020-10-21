// pages/dynamic/dynamic.js
var oldLineCount = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeSrc: false,
    cursorSpacing: "0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  releaseDynamicEvent: function () {

    wx.navigateTo({
      url: '../dynamicEdit/dynamicEdit',
    })
  },

  likeEvent: function () {

    this.setData({
      likeSrc: !this.data.likeSrc
    })
  },

  bindconfirm: function(e) {
    console.log("点击完成")
  },

  bindlinechange: function(e) {
    console.log(e);
    if (parseInt(e.detail.lineCount) < oldLineCount ) {
      this.setData({
        cursorSpacing: "100"
      })
    }
    oldLineCount = parseInt(e.detail.lineCount);    
  }
})