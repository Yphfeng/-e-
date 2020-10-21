// pages/deviceList/deviceList.js
let mineService = require('../../common/newService/mineService');
let homeBluetooth = require('../home/homeBluetooth.js');
let qbBLEManager = require('../../bluetooth/manager.js');
import getAjax from '../../common/getAjax.js';
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        devices: [],
        phone: '',
        isPhone: true,
        isSend: true,
        sendText: '获取验证码',
        code: '',
        showModal: false,
        notic: "", //这里是提示信息
        isdoltshow: false,
        isgetcode: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const self = this;
        //判断是否绑定了手机号
        mineService.isBindPhone(function(res) {
            if (res.data.status == 2) {
                self.setData({
                    isBindPhone: true
                })
            } else {
                self.setData({
                    isBindPhone: false
                })
            }
        }, function(err) {

        })


    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

        var self = this;
        // wx.showLoading({});
        mineService.getUserDeviceList(function(res) {
            // wx.hideLoading();
            if (res.statusCode == 200 && res.data.status == 1) {
                self.setData({
                    devices: res.data.device_list,
                });
            } else {
                wx.showToast({
                    icon: 'none',
                    title: res.data.mgs ? res.data.mgs : '网络出错',
                })
            }
        }, function(err) {
            wx.hideLoading();
            wx.showToast({
                title: '网络错误',
            })
        })

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    addDeviceEvent: function() {
        if (this.data.isBindPhone) {
            wx.navigateTo({
                url: '../deviceSearch/deviceSearch',
            })
        } else {
            this.setData({
                    showModal: true
            })
        }



    },

    radioChange: function(e) {
        let self = this;
        let deviceId = e.detail.value;
        var deviceInfo = app.getDeviceInfo();
        // if (deviceInfo.isConnect) {
        //     homeBluetooth.disconnectDeviceEvent(self);
        // }
        this.data.devices.forEach(v => {
            if (v.device_sn == deviceId) {
                deviceInfo.deviceName = v.device_name;
                deviceInfo.deviceCode = v.device_code;
                deviceInfo.deviceIdentificationCode = v.device_sn;
                app.setDeviceInfo(deviceInfo);
            }
        })
    },

    disbindingEvent: function(e) {
        const deviceSN = e.currentTarget.dataset.deviceId;
        let self = this;
        this.data.devices.forEach((v, index) => {
            if (v.device_sn == deviceSN) {
                wx.showModal({
                    title: '是否解绑',
                    content: '',
                    success: function(res) {
                        if (res.confirm) {
                            self.unBinding(v, index);
                        }
                    }
                })
                return;
            }
        })
    },

    unBinding(device, removeIndex) {
        let self = this;
        wx.showLoading({
            title: '正在解绑',
        })
        var deviceInfo = app.getDeviceInfo();
        deviceInfo.deviceName = "";
        deviceInfo.deviceCode = "";
        deviceInfo.deviceIdentificationCode = "";
        deviceInfo.isConnect = false;
        app.setDeviceInfo(deviceInfo);
        mineService.unbindDevice((res) => {
            wx.hideLoading();
            if (res.data.status == 1) {
                var devices = self.data.devices;
                devices.splice(removeIndex, 1);
                // 设置界面
                self.setData({
                    devices: devices
                })
                wx.showToast({
                    title: '解绑成功',
                })

                homeBluetooth.isOpenBLEAdapter(false, function() {});
            } else {
                wx.showModal({
                    title: '解绑失败',
                    content: res.data.msg,
                })
            }
        }, (err) => {
            console.log(err);
        })
    },
    backHome() {
        wx.navigateBack({
            url: '../home/home'
        })
    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function() {
        this.setData({
            showModal: false
        });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function() {
        this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
      const self = this;
      const user = wx.getStorageSync("user");
      // 判断验证码是否正确
      if (!this.data.phone) {
        self.setData({
          notic: '手机号不能为空',
          isdoltshow: true
        })
        return;
      }
      if (!this.data.code) {
        self.setData({
          notic: '验证码不能为空',
          isdoltshow: true
        })
        return;
      }
      wx.showLoading({
        title: '请稍后',
      })
      mineService.getRegVerify({ code: self.data.code, uid: self.data.uid }, function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.status == 1) {
          mineService.bindPhone({
            wx_user_name: user.wx_user_name,
            head_portrait: user.wx_head_portrait,
            phone: self.data.phone 
          }, function (res) {
            console.log(res);
            if (res.data.status == 1) {
              if (res.data.bind_status !== 2) {
                
                wx.showToast({
                  title: '绑定成功',
                })
                self.setData({
                  isSend: false,
                  isBindPhone: true,
                  showModal: false
                })
              }
              if (res.data.bind_status == 2) {
                getAjax.getPost("Weixin/UserBindPhone/saveUserinfo", {
                  wx_user_name: user.wx_user_name,
                  head_portrait: user.wx_head_portrait,
                  open_id: app.globalData.open_id,
                  armariumScienceSession: res.data.data.armarium_science_user_session
                })
                  .then((response) => {
                    if (response.data.status == 1) {
                      wx.showToast({
                        title: '绑定成功',
                      })
                      user.token = res.data.data.armarium_science_user_session;
                      wx.setStorageSync("user", user);
                      self.setData({
                        isSend: false,
                        isBindPhone: true,
                        showModal: false
                      })
                    }
                  })
                  .catch((errst) => {

                  })

              }
              self.hideModal();
            } else {
              wx.showToast({
                title: '绑定失败'
              })
            }
          }, function (err) {
            wx.showToast({
              title: '绑定失败'
            })
          })
        } else {
          self.setData({
            notic: '验证码错误',
            isdoltshow: true
          })

        }
      })

    },
    //手机号输入框
    inputChange(e) {
      const testValue = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;
      const val = e.detail.value;
      this.setData({
        phone: val,
        notic: '',
        isdoltshow: false

      })
      if (testValue.test(val)) {
        this.setData({
          isPhone: false,
        })
      } else {
        this.setData({
          isPhone: true
        })
      }
    },
    //code输入框
    inputCodeChange(e) {
      const self = this;
      var vl = e.detail.value;
      self.setData({
        code: vl,
        notic: '',
        isdoltshow: false
      })
      // mineService.getRegVerify({ code: vl, uid: this.data.uid }, function(res) {
      //     console.log(res)
      //     if (res.data.status == 1) {
      //         self.setData({
      //             isSend: false
      //         })
      //     } else {
      //         self.setData({
      //             isSend: true
      //         })
      //     }
      // })
      if (vl) {
        self.setData({
          isSend: false
        })
      } else {
        self.setData({
          isSend: true
        })
      }

    },
    //发送验证码
    send() {
      const self = this;
      var data = { phone: this.data.phone };
      console.log(data);
      // 判断手机号是否正确
      if (!this.data.isPhone) {
        
        self.setData({
          isgetcode: true
        })
        wx.showLoading({
          title: '发送中',
        })
        mineService.sendRegVerify(data, function (res) {
          wx.hideLoading();
          if (res.data.status == 1) {
            wx.showToast({
              title: "验证码发送成功",
              icon: 'none'
            })
            
            self.setData({
              isgetcode: true,
              uid: res.data.uid
            })
            var currentTime = 60;
            const interval = setInterval(function () {
              self.setData({
                sendText: (currentTime - 1) + '秒'
              })
              currentTime--;
              if (currentTime <= 0) {
                clearInterval(interval)
                self.setData({
                  sendText: '重新获取',
                  currentTime: 60,
                  isgetcode: false
                })
              }
            }, 1000)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            self.setData({
              isgetcode:false
            })
          }
        }, function (err) {
          wx.hideLoading();
          wx.showToast({
            title: '发送失败',
            icon: 'none'
          })
          self.setData({
            isgetcode: false
          })
        })
      } else {
        this.setData({
          notic: '请输入正确的手机号码',
          isdoltshow: true
        })
      }

    }
})