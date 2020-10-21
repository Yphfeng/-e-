//app.js
import getAjax from './common/getAjax.js'
import admin from './admin.js'
App({
    
    onLaunch: function() {
        var _this = this;
        // wx.navigateTo({
        //   url: '/pages/users/index/index'
        // })
    },
    editTabBar: function() {
        var tabbar = this.globalData.tabbar,
            currentPages = getCurrentPages(),
            _this = currentPages[currentPages.length - 1],
            pagePath = _this.__route__;
        (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
        for (var i in tabbar.list) {
            tabbar.list[i].selected = false;
            (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
        }
        _this.setData({
            tabbar: tabbar
        });
    },
    urlWWW: admin.urlWWW,
    globalData: {
        userInfo: null,
        code: '',
        open_id: '',
        ajaxSuccess:0
    },
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
  ],
    urlPrefix: admin.urlPrefix,
    loginType: '1',
    screenWidth: wx.getSystemInfoSync().windowWidth,
    screenHeight: wx.getSystemInfoSync().windowHeight,
    phonePlatform: wx.getSystemInfoSync().platform,
    getDeviceInfo() {
        var deviceInfo1 = wx.getStorageSync('deviceInfo');
        if (typeof deviceInfo1 != 'object') {
            var deviceInfo = new Object();
            deviceInfo.isAutoHrState = false;
            deviceInfo.EQ = 0;
            deviceInfo.deviceCode = "";
            deviceInfo.deviceName = "";
            deviceInfo.deviceIdentificationCode = "";
            deviceInfo.isShowDisconnectButton = false;
            deviceInfo.isConnect = false;
            deviceInfo.device = new Object();
            wx.setStorageSync("deviceInfo", deviceInfo);
            return deviceInfo;
        } else if (deviceInfo1.deviceIdentificationCode == null) {
            wx.removeStorageSync("deviceInfo");
            var deviceInfo = new Object();
            deviceInfo.isAutoHrState = false;
            deviceInfo.EQ = 0;
            deviceInfo.deviceCode = "";
            deviceInfo.deviceName = "";
            deviceInfo.deviceIdentificationCode = "";
            deviceInfo.isShowDisconnectButton = false;
            deviceInfo.isConnect = false;
            deviceInfo.device = new Object();
            wx.setStorageSync("deviceInfo", deviceInfo);
            return deviceInfo;
        } else {
            return deviceInfo1;
        }
    },
    setDeviceInfo(deviceInfo) {
        wx.setStorage({
            key: 'deviceInfo',
            data: deviceInfo,
        })
    },

    getUser() {
        var user = wx.getStorageSync("user");
        return user;
    },

    getLocaltionLog() {
        var logObject = wx.getStorageSync('localtionLog');
        if (typeof logObject != 'object') {
            var logObject1 = new Object();
            logObject1.logArray = [];
            wx.setStorage({
                key: 'localtionLog',
                data: logObject1,
            })
            return logObject1.logArray;
        }
        return logObject.logArray
    },

    setLocaltionLog(logs) {
        var logObject = new Object();
        logObject.logArray = logs
        wx.setStorage({
            key: 'localtionLog',
            data: logObject,
        })
    },

    removeLocaltionLog() {
        wx.removeStorage({
            key: 'localtionLog',
            success: function(res) {},
        })
    },

    getPlatform() {
        return wx.getSystemInfoSync().platform;
    },

    getSystemVersion() {
        return wx.getSystemInfoSync().system;
    },

    getBoolSugarTimePeriodNames() {

        var typeNumber = wx.getStorageSync("boolSugarType");
        if (typeNumber == "口服") {
            return {
                data: ["早餐前", "午餐前", "晚餐前"],
                name: "口服"
            }
        } else if (typeNumber == "外涂") {
            return {
                data: ["早餐前", "早餐后", "涂抹后"],
                name: "外涂"
            }
        } else {
            return null
        }
    },

    setBoolSugarType(typeNumber) {
        wx.setStorage({
            key: 'boolSugarType',
            data: typeNumber,
        })
    },
})