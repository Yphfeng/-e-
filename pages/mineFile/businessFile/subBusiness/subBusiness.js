let businessService = require('../../../../common/newService/businessService.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    businessList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sys = wx.getSystemInfoSync();
    this.setData({
      scrollHeight: sys.windowHeight - 60 - 30 - 3, 
      width: sys.windowWidth
    })
    this.pageIndex = 1;
    this.getWholesalerSubUser(1);
  },

  getWholesalerSubUser(pageIndex) {
    let self = this;
    businessService.getWholesalerSubUser({ }, function (res) {
      self.totalPageCount = res.data.count ? res.data.count : 1;
      if (res.statusCode == 200 && res.data.status == 1) {
        self.setData({
          businessList: res.data.user_list,
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

  callPhoneEvent: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phoneNum + '',
      success: function (res) {
        // console.log(res);
      },
      fail: function (res) {
        // console.log(res)
      },
      complete: function (res) { },
    })
  },
  sortEvent: function (e) {

    switch (e.currentTarget.dataset.type) {
      case 'user':
        this.setData({
          isSortUser: !this.data.isSortUser
        })
        return;
      case 'device':
        this.setData({
          isSortDevice: !this.data.isSortDevice
        })
        return;
      default:
        return;
    }
  }
})