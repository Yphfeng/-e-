var mineService = require('../../common/newService/mineService');
var homeBluetooth = require('../home/homeBluetooth.js');
var qbBLEManager = require('../../bluetooth/manager.js');
var app = getApp();
// wallet.js
var remark = "";
var deviceId = "";
var myTimeout;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userEbi: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.onBLE();
  },

  onShow: function (options) {
    var deviceInfo = app.getDeviceInfo();
    if (deviceInfo.isConnect != true) {
      wx.showToast({
        title: '请先连接设备',
      })
      return;
    }
    wx.showLoading({ title: '', });
    myTimeout = setTimeout(function(){
      wx.hideLoading();
      clearTimeout(myTimeout);
      wx.showToast({
        title: '获取失败，请连接设备',
      })
    }, 5000);
    qbBLEManager.getLaserManuallyParameters();
  },
  getEBi() {
    homeBluetooth.getEBi();
  },
  onBLE() {

    var self = this;
    homeBluetooth.onBLE(self, {
      onBLEAdapterCallBack: function (res) {
      },
      onBLESearchDevicesCallBack: function (res) {
      },
      receiveMessageCallBack: function (res) {
        console.log(res);
        var ebiValue = parseFloat(res.body.duration / 100).toFixed(2);
        self.setData({
          userEbi: ebiValue
        })
        clearTimeout(myTimeout);
        wx.hideLoading();


        mineService.updateUserDeviceEBi(parseInt(res.body.duration / 100), function(res){ }, function(err){ })
      }
    })
  }
})

