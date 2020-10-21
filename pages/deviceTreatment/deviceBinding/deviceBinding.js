// pages/deviceTreatment/deviceBinding/deviceBinding.js
let mineService = require('../../../common/newService/mineService.js');
let courseService = require('../../../common/newService/courseService.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topToolBarItems: [{
      key: 0,
      isSelected: true,
      title: '治疗仪清单'
    }, {
      key: 1,
      isSelected: false,
      title: '不在清单内'
    }],
    pageStatus: 0,
    devices: [],
    types: [{
      key: 0,
      title: '扫码',
      isSelected: true
    }, {
      key: 1,
      title: '输入',
      isSelected: true
    }],
    inputTipsText: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.courseId = options.courseId;
    console.log(this.courseId);
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          windowHeight: res.windowHeight
        })
      },
    })
    // 获取用户设备列表
    mineService.getUserDeviceList(function (res) {
      if (res.statusCode == 200) {
        self.setData({
          devices: res.data.device_list
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '获取治疗仪列表失败',
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

  topViewTapEvnet: function (e) {

    const key = e.currentTarget.dataset.key;
    var _toolBarItems = this.data.topToolBarItems;
    _toolBarItems.forEach(v => {
      if (v.key == key) {
        v.isSelected = true;
      } else {
        v.isSelected = false;
      }
    })
    const _devices = this.data.devices;
    _devices.forEach(v => {
      v.checked = false
    })
    this.deviceId = null;
    this.setData({
      topToolBarItems: _toolBarItems,
      pageStatus: key,
      deviceId: '请选择以下其中一种方式，绑定治疗仪。',
      isShowInputView: false,
      devices: _devices
    })
  },

  radioChange: function (e) {
    this.deviceId = e.detail.value;
  },

  typeEvent: function (e) {

    switch (e.currentTarget.dataset.key) {
      case 0:
        const self = this;
        wx.scanCode({
          onlyFromCamera: false,
          success: function (res) {
            self.deviceId = res.result;
            self.setData({
              deviceId: res.result
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        });
        break;
      case 1:
        this.setData({
          isShowInputView: true,
          inputTipsText: ''
        })
        break;
      default: break;
    }
  },

  inputViewEvent: function (e) {
    if (e.currentTarget.dataset.event == 'close') {
      this.setData({
        isShowInputView: false,
      })
    } else if (e.currentTarget.dataset.event == 'sure') {
      if (this.inputDeviceId) {
        this.deviceId = this.inputDeviceId;
        this.setData({
          isShowInputView: false,
          deviceId: this.inputDeviceId
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '编号不能为空',
        })
      }
    }
  },
  inputEvent: function (e) {
    var _value = e.detail.value.toUpperCase();
    var _message = "";
    if (_value.length != 16) {
      _message = "治疗仪编号长度不正确";
    } else { // 需要根据产品编号规则进行改变以下判断
      let subStr = _value.substr(0, 1);
      let subStr2 = _value.substr(1, 1);
      if (subStr == "A" && (subStr2 == 'A' || subStr2 == 'B' || subStr2 == 'C' || subStr2 == 'D' || subStr2 == 'E' || subStr2 == 'Z')) {
        this.inputDeviceId = _value;
        _message = "可以正常使用";
      } else {
        _message = "治疗仪编号不符合规范";
      }
    }
    this.setData({
      inputTipsText: _message
    })
  },
  submitEvient: function () {
    if (this.deviceId) {
      const self = this;
      wx.showModal({
        title: '绑定到该治疗仪？',
        content: '治疗仪编号: ' + this.deviceId,
        success: function (res) {
          if (res.confirm) {
            courseService.bindUserArticle({
              device_sn: self.deviceId,
              article_id: self.courseId
            }, function (res) {
              if (res.statusCode == 200 && res.data.status == 1) {
                wx.showModal({
                  title: '绑定成功',
                  content: '',
                  success: function(res) {
                    wx.navigateBack({});
                  }
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
          }
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请选择治疗仪',
      })
    }
  }
})