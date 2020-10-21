// pages/mineFile/integral/ambassadorOk/ambassadorOk.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      _width: '',
      _height: ''
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
    const width = wx.getSystemInfoSync().windowWidth;
    const height = wx.getSystemInfoSync().windowHeight;
    this.setData({
      _width: width,
      _height:height
    })
  
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
  goBack(){
    wx.redirectTo({
      url: "/pages/mine/mine"
    })
  },
  gorecomuser(){
    wx.navigateTo({
      url: "/pages/mineFile/integral/recomUser/recomUser"
    })
  },
  gainRecording(){
    wx.navigateTo({
      url: "/pages/mineFile/integral/gainRecording/gainRecording"
    })
  },
  goearning(){
    wx.navigateTo({
      url: "/pages/mineFile/integral/earning/earning"
    })
  },
  gorecordDraw(){
    wx.navigateTo({
      url: "/pages/mineFile/integral/recordDraw/recordDraw"
    })
  }
})