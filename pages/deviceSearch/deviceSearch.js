// pages/deviceSearch/deviceSearch.js
let homeBluetooth = require('../home/homeBluetooth.js');
let mineService = require('../../common/newService/mineService');
let app = getApp();
var devices;
var isOpenBLEAdapter = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    devices: [ ],
    // QRViewColor: "black",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      scrollViewHeight: wx.getSystemInfoSync().windowHeight - 49 - 48 - 10 - 3
    });


    if (app.getPlatform().toLocaleLowerCase() == 'android') {
      wx.showModal({
        title: '提示',
        content: '安卓6.0以上系统需要开启定位功能',
      })
    }


    this.onBLE();
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

  onUnload: function () {

    isOpenBLEAdapter = false;
    homeBluetooth.isStartSearchDevice1(false);
    homeBluetooth.isOpenBLEAdapter(false, function () { })
  },

  onBLE() {

    const self = this;
    homeBluetooth.getBLEAdapterState(function (res) { // 获取蓝牙适配器状态

      if (res.available == true) {
        isOpenBLEAdapter = true;
        wx.showToast({
          title: '蓝牙可使用',
        })
        self.setData({
          searchViewColor: "#f35b4a",
          QRViewColor: "black",
          isBeginSearch: true,
          devices: []
        })
        homeBluetooth.isStartSearchDevice1(true);
        setTimeout(()=>{
          self.setData({
            searchViewColor: "#f35b4a",
            QRViewColor: "black",
            isBeginSearch: false
          })
          homeBluetooth.isStartSearchDevice1(false);
        },4000)
      } else {
        homeBluetooth.isOpenBLEAdapter(true, function (res) { // 打开蓝牙适配器
          if (res) {
            isOpenBLEAdapter = false;
            wx.showToast({
              icon: "none",
              title: '蓝牙不可使用',
            })
          } else {
            isOpenBLEAdapter = true;
            wx.showToast({
              title: '蓝牙可使用',
            })
            self.setData({
              searchViewColor: "#f35b4a",
              QRViewColor: "black",
              isBeginSearch: true,
              devices: []
            })
            homeBluetooth.isStartSearchDevice1(true);
            setTimeout(() => {
              self.setData({
                searchViewColor: "#f35b4a",
                QRViewColor: "black",
                isBeginSearch: false
              })
              homeBluetooth.isStartSearchDevice1(false);
            }, 4000)
          }
        })
      }
    });

    homeBluetooth.onBLE(self, {

      onBLEAdapterCallBack: function (res) {

        if (res.available == true && isOpenBLEAdapter == false) {
          isOpenBLEAdapter = true;
          homeBluetooth.isOpenBLEAdapter(true, function (res) {
            homeBluetooth.isStartSearchDevice1(true);
          })
        } else if (res.available == false) {
          isOpenBLEAdapter = false;
          devices = null;
          self.setData({
            devices: []
          })
        }
      },

      onBLESearchDevicesCallBack: function (dic) {
        devices = self.data.devices;
        
        for (var i = 0; i < devices.length;i++){
          if(devices[i].deviceIdentificationCode == dic.deviceIdentificationCode) {
            return;
          }
        }
        
        let item = {
          deviceIdentificationCode: dic.deviceIdentificationCode,
          deviceCode: dic.deviceName
        }
        devices.push(item);
        self.setData({
          devices: devices
        })
      },
      receiveMessageCallBack: function (res) {
        console.log(res);
      }
    })
  },

  radioChange: function (e) {
    this.deviceId = e.detail.value;
  },

  submitEvient: function () {

    let deviceId = this.deviceId;
    if (deviceId == undefined) {
      wx.showToast({
        icon: 'none',
        title: '请选择设备',
      })
      return
    }
    wx.showModal({
      title: '是否绑定',
      content: '编号: ' + deviceId,
      success: function (res) {

        if (res.confirm) {
          wx.showLoading({
            title: '正在绑定',
          })
          
          mineService.bindingDevice(deviceId, function (res) {

            wx.hideLoading();
            if (res.data.status == 1) {
              wx.showToast({
                title: '绑定成功',
              })
              wx.navigateBack({ });
            } else {
              wx.showModal({
                icon: "none",
                title: '绑定失败',
                content: res.data.msg,
              })
            }
          }, function (err) {
            wx.showModal({
              icon: "none",
              title: '绑定失败',
              content: '网络出错',
            })
          })
        }
      }
    })
  },

  bindingTypeEvent: function (e) {
    var self = this;
    switch (e.currentTarget.dataset.type) {
      case "beginSearch":
        if (isOpenBLEAdapter == false) {
            wx.showToast({
              title: '蓝牙不可使用',
            })
            return;
        }
        // this.setData({
        //   searchViewColor: "#f35b4a",
        //   QRViewColor: "black",
        //   isBeginSearch: true,
        //   devices: []
        // })
        // homeBluetooth.isStartSearchDevice1(true); // 开始搜索

        self.setData({
          searchViewColor: "#f35b4a",
          QRViewColor: "black",
          isBeginSearch: true,
          devices: []
        })
        homeBluetooth.isStartSearchDevice1(true);
        setTimeout(() => {
          self.setData({
            searchViewColor: "#f35b4a",
            QRViewColor: "black",
            isBeginSearch: false
          })
          homeBluetooth.isStartSearchDevice1(false);
        }, 4000)
        break;
      case "stopSearch":
        // this.setData({
        //   searchViewColor: "#f35b4a",
        //   QRViewColor: "black",
        //   isBeginSearch: false
        // })
        // console.log(this.data.devices);
        // homeBluetooth.isStartSearchDevice1(false); // 开始搜索
        // break;
        return;
      case "QR":
        this.setData({
          searchViewColor: "black",
          QRViewColor: "#f35b4a",
          isBeginSearch: false,
          devices: []
        });
        homeBluetooth.isStartSearchDevice1(false); // 开始搜索
        this.beginQR(); // 调用扫码
        break;
      default:
        break;
    }
  },
  beginQR: function () {

    let self = this;
    wx.scanCode({
      success: function (res) {
        if (res.result.length == 16) {
          self.deviceId = res.result;
          self.setData({
            devices: [{
              deviceIdentificationCode: res.result,
              checked: 'true'
            }]
          })
        } else {
          wx.showToast({
            title: '错误二维码',
          })
        }
      },
      fail: function (res) {

        if (res.errMsg) {
          if (res.errMsg.indexOf("cancel") == (res.errMsg.length - "cancel".length)) {
            wx.showToast({
              icon: "none",
              title: '取消',
            })
          } else {
            wx.showToast({
              icon: "none",
              title: '调用失败',
            })
          }
        }
      }
    })
  },
})