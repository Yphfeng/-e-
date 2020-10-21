let businessService = require('../../../../common/newService/businessService.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    incomeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sys = wx.getSystemInfoSync();
    this.setData({
      scrollHeight: sys.windowHeight - 60 - 30,
      width: sys.windowWidth
    })
    this.getWholesalerProfit(1);
    this.pageIndex = 1;
  },

  getWholesalerProfit(pageIndex) {

    let self = this; 
    businessService.getWholesalerProfit({ }, function (res) {
      self.totalPageCount = res.data.count ? res.data.count : 1;
      if (res.statusCode == 200 && res.data.status == 1) {
        self.setData({
          incomeList: res.data.profit_list,
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.msg ? res.data.msg : '网络出错',
        })
      }
    }, function (err) {
      wx.showToast({
        icon: 'none',
        title: '网络出错',
      })
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

  }
})