// home.js
var homeBluetooth = require('homeBluetooth');
var bluetoothCenter = require('../../bluetooth/center');
const mineService = require('../../common/newService/mineService.js');
import getAjax from '../../common/getAjax';
var errorLog = require('errorLog');
var app = getApp();
Page({

    data: {
        isShowDisconnectButton: false,
        isExistsDeviceInCache: false,
        deviceEQ: 80,
        showModal: false,
        isConnectModel: false,
        liaocheng: [],
        specItem: {},
        dialogWidth: '',
        _height: '',
        display: 'block',
        indexed: 0,
        loginstatus:0,
        dataNavBar: [{
                id: 0,
                pagePath: "/pages/home/home",
                text: "设备",
                iconPath: "../../images/home_normal.png",
                selectedIconPath: "../../images/home_selected.png"
            },
            {
                id: 1,
                pagePath: "/pages/dynamicdFile/dynamicdMain",
                text: "动态",
                iconPath: "../../images/dynamic_normal@3x.png",
                selectedIconPath: "../../images/dynamic_selected@3x.png"
            },
            {
                id: 2,
                pagePath: "/pages/mine/mine",
                text: "我的",
                iconPath: "../../images/mine_normal.png",
                selectedIconPath: "../../images/mine_selected.png"
            }
        ]
    },

    /**deviceEQ
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        const _this = this;
        const pageId = options.pageId || '';
        this.setData({
          dataNavBar: app.dataNavBar
        })
        if(pageId) {
            wx.navigateTo({
                url: '/pages/mineFile/shop/commodity/commodity?commodityId=' + pageId
            })
            return;
        }
        var deviceInfo = app.getDeviceInfo();
        deviceInfo.isConnect = false;
        app.setDeviceInfo(deviceInfo);
        wx.setStorageSync("deviceInfo", deviceInfo);
        const scene = decodeURIComponent(options.scene) || '';
        console.log(scene);
        var user_id, user_type;
        if (scene && scene !== "undefined") {
            user_id = scene.split("_")[0].split(":")[1];
            user_type = scene.split("_")[1].split(":")[1];
        } else {
            user_id = '';
            user_type = '';
        }
        _this.setData({
            user_id: user_id,
            user_type: user_type
        })
        wx.setStorageSync("user_id", user_id);

        
    },
    onShow: function(options) {
        const _this = this;
        var info = wx.getSystemInfoSync();
        this.setData({
            _width: info.windowWidth,
            __height: info.windowHeight,
            dialogWidth: info.windowWidth - 40,
            _height: info.windowHeight - 280
        })
      var user = app.getUser();

      if (user.token){
        this.getUserDeviceList();
      }else{
        this.setData({
          loginstatus:0
        })
        this.setData({
          display: "block"
        })
      }
      
        


    },
    getDeviceType() {
        const self = this;
        mineService.getDeviceType(function(res) {
            if (res.data.status == 1) {
                if (res.data.device_status == 1) {
                    if (res.data.user_course_list) {
                        var setTotal = res.data.user_course_list;
                        console.log(setTotal);
                        setTotal.forEach((v, index) => {
                            v.selectedColor = 'black';
                            v.key = index;
                        })
                        self.setData({
                            liaocheng: setTotal,
                            isConnectModel: true
                        })
                    }

                } else {
                    wx.removeStorageSync("deviceInfo");
                }
            } else {
                self.setData({
                    isConnectModel: false
                })
            }
        }, function(err) {})
    },
    getUserDeviceList() {
        const self = this;
        mineService.getUserDeviceList(function(res) {
            if (res.statusCode == 200) {
              console.log(res);
              // var deviceInfos = res.data.device_list[0];
              // deviceInfos.deviceIdentificationCode = res.data.device_list[0].device_sn;
              // wx.setStorageSync("deviceInfo", deviceInfos)
                const deviceInfo = app.getDeviceInfo();
                console.log(deviceInfo);
                if (deviceInfo.deviceCode.length == 0) {
                    self.setData({
                        isExistsDeviceInCache: false
                    })
                } else {
                    self.setData({
                        deviceName: deviceInfo.deviceName,
                        deviceCode: deviceInfo.deviceCode,
                        deviceIdentificationCode: deviceInfo.deviceIdentificationCode,
                        isShowDisconnectButton: deviceInfo.isConnect,
                        deviceEQ: deviceInfo.EQ,
                        isExistsDeviceInCache: true
                    })
                }
                homeBluetooth.onBLE(self);
            }
        }, function(err) {})
    },

    
    itemContentViewEvent: function(e) {
        switch (e.currentTarget.dataset.name) {
            case "shebeiliebiao":
                wx.navigateTo({
                    url: '../deviceList/deviceList',
                })
                break;
            case "shuju":
                wx.setStorageSync('firmwareVersion', this.data.firmwareVersion);
                // if (this.data.isShowDisconnectButton) {
                //   if (this.data.firmwareVersion.length == 7 && this.data.firmwareVersion >= 'V1.6.11') {
                //     wx.navigateTo({
                //       url: '../deviceData/deviceData',
                //     })
                //   } else {
                //     wx.showModal({
                //       title: '需要升级',
                //       content: '请到公众号下载App，对治疗仪进行升级。',
                //     })
                //   }
                // } else {
                //   wx.showToast({
                //     icon: "none",
                //     title: '请先连接治疗仪',
                //   })
                // }
                wx.navigateTo({
                    url: '../deviceData/deviceData',
                })
                break;
            case "liaocheng":
                wx.navigateTo({
                    url: '../deviceTreatment/deviceTreatment',
                })
                break;
            case "eBi":
                if (this.data.isShowDisconnectButton) {
                    wx.navigateTo({
                        url: '../deviceECoin/deviceECoin',
                    })
                } else {
                    wx.showToast({
                        icon: "none",
                        title: '请先连接治疗仪',
                    })
                }
                break;
            case "lanyayingyong":
                // if (this.data.isShowDisconnectButton) {
                //   wx.navigateTo({
                //     url: 'commonFunctional',
                //   })
                // } else {
                //   wx.showToast({
                //     icon: "none",
                //     title: '请先连接治疗仪',
                //   })
                // }
                wx.navigateTo({
                    url: 'commonFunctional',
                })
                break;
            case "gujianbanben":
                if (this.data.isShowDisconnectButton) {
                    wx.navigateTo({
                        url: '../deviceVersion/deviceVersion?version=' + this.data.firmwareVersion + '&devicesn=' + this.data.deviceIdentificationCode,
                    })
                } else {
                    wx.showToast({
                        icon: "none",
                        title: '请先连接治疗仪',
                    })
                }
                break;
            default:
                break;
        }
    },

    getEQEvent: function() {
        var self = this;
        homeBluetooth.getEQ(self);
    },

    connectBTNEvent: function(e) {
        const self = this;
        switch (e.currentTarget.dataset.name) {
            case "disconnect":
                homeBluetooth.disconnectDeviceEvent(self);
                break;
            case "connect":
                homeBluetooth.beginSearchPeripheral(self);
                break;
            default:
                return;
        }
    },

    helpImageEvent(e) {

        const eventType = e.currentTarget.dataset.helpImage;
        var title, content;
        switch (eventType) {
            case 'deviceEQ':
                title = '电量指示说明';
                content = '当治疗仪电量低于5%时，治疗仪进入低电保护状态，激光和心率将不会开启，请尽快对治疗仪进行充电。正常充满电需3小时左右，以不影响您正常使用治疗仪。';
                break;
            case 'connect':
                title = '蓝牙连接说明';
                content = '本蓝牙系统根据微信小程序蓝牙接口开发，目前主要支持苹果系统和安卓系统4.3以上主流机型(苹果、华为、小米、魅族、vivo、乐视、oppo等)。如遇到小程序无法连接蓝牙设备时，请按顺序执行以下操作：1、请在点击连接设备的同时摇动设备激活（触摸版无此功能）蓝牙广播，有实体按键版也可按设备按键进行蓝牙广播；2、将微信升级到最新版本；3、请先关闭手机蓝牙然后重新打开手机蓝牙，进行设备连接。';
                break;
            case 'laser':
                title = '手动弱激光开启说明';
                content = '开启后，激光将以智能模式开启24分钟后自动关闭（设备读取不到心率数据时将自动关闭激光输出），过程中您也可以手动关闭激光。设备将记录您最近7天内的激光使用数据并同步到服务器，您可以在健康管理界面中进行查看。当电量低于20%时，设备将进入低电保护状态，激光及心率功能将不会开启，为了不影响您的正常使用，请及时为设备充电。';
                break;
            case 'autoHeartRate':
                title = '自动心率监测说明';
                content = '开启后，每15分钟自动启动一次心率监测，每次持续1.5分钟。自动心率数据可在健康管理界面中同步查看，此心率数据仅用作即时查看，不适于医疗诊断应用。自动心率功能开启后将会适度增加设备耗电量。';
                break;
            case 'realtimeHR':
                title = '即时心率说明';
                content = '开启后，持续监测3分钟后关闭，检测到的心率数据将在5秒钟后即时显示在按钮旁边的红色位置。此心率数据仅用作即时查看，不适用医疗诊断应用。';
                break;
            default:
                return
        }
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
        })
    },
    showDialogBtn: function(e) {
        var self = this;
        mineService.getDeviceType(function(res) {
            if (res.data.status == 1) {
                if (res.data.device_status == 1) {
                    if (res.data.conf_status == 1) {
                        var setTotal = res.data.user_course_list;
                        console.log(setTotal);
                        setTotal.forEach((v, index) => {
                            v.selectedColor = 'black';
                            v.key = index;
                        })
                        self.setData({
                            liaocheng: setTotal,
                            isConnectModel: true
                        })
                    } else {
                        self.setData({
                            isConnectModel: false
                        })
                    }

                    var deviceInfo = wx.getStorageSync("deviceInfo");
                    if (self.data.isConnectModel) {
                        self.setData({
                            showModal: true
                        })
                    } else {
                        self.connectBTNEvent(e);
                    }

                } else {
                    wx.removeStorageSync("deviceInfo");
                    wx.showToast({
                        title: res.data.msg
                    })
                    setTimeout(function() {
                        wx.reLaunch({
                            url: '/pages/home/home'
                        })
                    }, 2500)
                }
            } else {
                wx.showToast({
                    title: res.data.msg
                })
            }
        }, function(err) {
            wx.showToast({
                title: 'res.data.msg'
            })
            setTimeout(function() {
                wx.reLaunch({
                    url: '/pages/home/home'
                })
            }, 2500)
        })

    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function() {},
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
    onConfirm: function(e) {

        const self = this;
        console.log(this.data.specItem);
        if (!this.data.specItem.id) {
            wx.showToast({
                title: '请选择疗程',
                icon: 'none'
            })
        } else {
            this.hideModal();
            var id = this.data.specItem.id;
            mineService.setIeaseDeviceCourse({ user_course_id: id }, function(res) {
                console.log(res)
                if (res.data.status == 1) {
                    switch (e.currentTarget.dataset.name) {
                        case "disconnect":
                            homeBluetooth.disconnectDeviceEvent(self);
                            break;
                        case "connect":
                            homeBluetooth.beginSearchPeripheral(self);
                            break;
                        default:
                            return;
                    }
                } else {
                    wx.showToast({
                        title: '请求出错',
                        icon: 'none'
                    })
                }

            }, function(err) {

            })

        }
    },
    drawerEvent: function(e) {
        var self = this;
        var index = e.currentTarget.dataset.type;
        var liaocheng = this.data.liaocheng;
        liaocheng.forEach(v => {
            if (v.key == parseInt(e.currentTarget.dataset.type)) {
                v.selectedColor = "#f35b4a";
                self.setData({
                    specItem: v
                })
            } else {
                v.selectedColor = "black";
            }
        })
        this.setData({
            liaocheng: liaocheng,
        })
    },
    
    goto(e) {
        console.log(getCurrentPages())
        var data = getCurrentPages();
        var d = 1;
        var url = e.currentTarget.dataset.url;
        for (var i = 0; i < data.length; i++) {
            if (data[i].route == url) {
                wx.navigateBack({
                    delta: i
                })
                d = 2;
            }
        }
        if (d !== 2) {
            wx.navigateTo({
                url: '/' + url
            })
        }

    },
    getUserInfo(e){
      const _this = this;
      const userInfo = e.detail.userInfo;
      if (!userInfo) {
        return
      }
      console.log(app.globalData.open_id);
      if (this.data.loginstatus==1){
        return;
      }
      this.setData({
        loginstatus:1
      })
      wx.showLoading({
        title: '正在加载',
      })
      wx.login({
        success:res=>{
          if (res.code) {
            console.log(res.code);
            app.globalData.code = res.code;
            
            getAjax.getPost("Weixin/Account/weChatLogin", { code: app.globalData.code }).then((res) => {
              app.globalData.open_id = res.data.open_id;
              wx.setStorageSync("ajaxSuccess", 0)
              getAjax.getPost("/Weixin/Account/saveWeChatUserInfo", {
                wx_user_name: userInfo.nickName,
                user_id: _this.data.user_id,
                open_id: app.globalData.open_id,
                head_portrait: userInfo.avatarUrl,
                login_type: 1
              })
                .then((res) => {
                  console.log(res);
                  wx.setStorageSync("user", res.data.data);
                  _this.setData({
                    display: 'none'
                  })
                  wx.hideLoading();
                  this.getDeviceType();
                  this.getUserDeviceList();
                })
                .catch((err) => {
                  console.log(err);
                })

            }).catch((err) => {
              console.log(err);
              wx.showToast({
                title: err.data.error_sn,
                icon: 'none'
              })
            })
          } else {
            console.log("获取code错误");
          }
        }
      })
    }


})