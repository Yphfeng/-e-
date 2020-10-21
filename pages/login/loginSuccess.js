// pages/login/loginSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_type: '',
    _height: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    this.setData({
      user_type: options.user_type
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        _this.setData({
          _height: res.windowHeight
        })
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
  goChannel() {
    wx.reLaunch({
      url: '../channelProvider/index/index',
    })
  },
  goUser() {
    wx.reLaunch({
      url: '../home/home',
    })
  },
  goMerchants() {
    wx.reLaunch({
      url: '../merchants/index/index'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})