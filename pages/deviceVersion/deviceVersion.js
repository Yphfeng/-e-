// pages/deviceVersion/deviceVersion.js
let deviceService = require('../../common/newService/deviceService.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  currentVersion: "",
  latestVersion: "",
  latestVersionMessage: "无"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _version = options.version;
    let _deviceSN = options.devicesn;
    let self = this;
    deviceService.getLatsetVersion({ device_sn: (_deviceSN ? _deviceSN : 'AZ01201801160013')}, function(res){
      if (res.statusCode == 200 && res.data.status == 1) {
        self.setData({
          latestVersionMessage: res.data.firmware.description,
          latestVersion: res.data.firmware.firmware,
          currentVersion: _version ? _version : ''
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg ? res.msg : '网络错误',
        })
      }
    }, function(err){})
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