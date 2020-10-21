// pages/home/commonFunctional.js
let app = getApp();
let qbBLEManager = require('../../bluetooth/manager.js')
let homeBluetooth = require('homeBluetooth.js');
let bluetoothApi = require('../../bluetooth/api.js');
let mineService = require('../../common/newService/mineService.js');
let errorLog = require('errorLog.js');
var isOpenBLEAdapter = false;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        hr_realtimeValue: 0,
        isShowPoint: true,
        isManuallyLaser: true,
        isManuallyHR: true,
        isAutoHR: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        const deviceInfo = app.getDeviceInfo();
        if (deviceInfo.device.name && (deviceInfo.device.name.indexOf("HA05") == 0 || deviceInfo.device.name.indexOf("HA06") == 0)) {
            this.setData({
                isShowPoint: true
            })
        } else {
            this.setData({
                isShowPoint: false
            })
        }

        this.onBLE();
    },

    onShow: function() {
        const self = this;
        qbBLEManager.getManuallyLaserState();
        mineService.getUserDeviceList(function(res) {
            if (res.statusCode == 200) {
                const deviceInfo = app.getDeviceInfo();
                if (deviceInfo.deviceCode.length == 0) {} else {
                    self.setData({
                        isShowDisconnectButton: deviceInfo.isConnect,

                    })
                }
            }
        }, function(err) {})
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
        qbBLEManager.isOpenRealtimeData(false);
    },

    buttonEvent: function(e) {

        let self = this;
        if (this.data.isShowDisconnectButton) {
            switch (e.currentTarget.dataset.state) {
                case "openManuallLaser":
                    qbBLEManager.setLaserManuallyParameters(4, 24);
                    break;
                case "closeManuallLaser":
                    qbBLEManager.isOpenLaserAction(false);
                    break;
                case "openManuallyHeartRate":
                    qbBLEManager.isOpenHrAction(true);
                    break;
                case "closeManuallyHeartRate":
                    qbBLEManager.isOpenHrAction(false);
                    break;
                case "openAutoHeartRate":
                    wx.showModal({
                        title: '是否开启自动心率',
                        content: '开启后，每15分钟测量一次,每次3分钟。同时会加快消耗设备电量，请确保电量充足。',
                        confirmText: '开启',
                        cancelText: '下次',
                        success: function(res) {
                            if (res.confirm) {
                                qbBLEManager.isOpenAutoHrAction(true);
                            } else {
                                self.setData({
                                    isAutoHR: true
                                })
                            }
                        }
                    })
                    break;
                case "closeAutoHeartRate":
                    qbBLEManager.isOpenAutoHrAction(false);
                    break;
                default:
                    break;
            }
        } else {
            wx.showToast({
                title: '请连接设备',
                icon: 'none'
            })
        }
    },


    onBLE() {

        const self = this;
        homeBluetooth.getBLEAdapterState(function(res) {

            if (res.available == true) {
                isOpenBLEAdapter = true;
            } else {
                homeBluetooth.isOpenBLEAdapter(true, function(res) {
                    if (res) {
                        isOpenBLEAdapter = false;
                        wx.showToast({
                            icon: "none",
                            title: '蓝牙不可使用',
                        })
                    } else {
                        isOpenBLEAdapter = true;
                    }
                })
            }
        });

        homeBluetooth.onBLE(self, {

            onBLEAdapterCallBack: function(res) {

                if (res.available == true && isOpenBLEAdapter == false) {
                    isOpenBLEAdapter = true;
                    homeBluetooth.isOpenBLEAdapter(true, function(res) {
                        homeBluetooth.isStartSearchDevice(true);
                    })
                } else if (res.available == false) {
                    isOpenBLEAdapter = false;
                    devices = null;
                    self.setData({
                        devices: []
                    })
                }
            },
            receiveMessageCallBack: function(item) {

                var body = item.body;
                switch (item.cmd) {

                    /***** 开启/关闭激光手动模式 *****/
                    case bluetoothApi.kGXYL_LaserManuallyParameters:
                        qbBLEManager.getLaserManuallyParameters();
                        break;
                    case bluetoothApi.kGXYL_GetLaserManuallyParameters:

                        let deviceEbi = parseFloat(parseInt(body.duration) / 100).toFixed(2);
                        if (deviceEbi > 0.00) {
                            qbBLEManager.isOpenLaserAction(true);
                            mineService.updateUserDeviceEBi(deviceEbi, function(res) {}, function(err) {})
                        } else {
                            wx.showModal({
                                title: '开启失败',
                                content: '设备中的e币不足,请充值',
                            })
                            self.setData({
                                isManuallyLaser: true
                            })
                        }
                        break;
                    case bluetoothApi.kGXYL_LaserIsOpen:
                        console.log("激光开启啦")
                        console.log(body);
                        if (body.setState == '设置成功') {
                            const state = !self.data.isManuallyLaser
                            self.setData({
                                isManuallyLaser: state
                            })
                        } else if (body.setState == '重复操作') {
                            wx.showToast({
                                icon: "none",
                                title: '重复操作',
                            })
                        } else {
                            self.setData({
                                isManuallyLaser: true
                            })
                            wx.showToast({
                                icon: "none",
                                title: '设置失败',
                            })
                        }
                        break;

                    case bluetoothApi.kGXYL_HRManuallyIsOpen:

                        if (body.setState == '设置成功') {
                            const state = !self.data.isManuallyHR
                            self.setData({
                                isManuallyHR: state
                            })
                            qbBLEManager.isOpenRealtimeData(!state);
                        } else {
                            self.setData({
                                isManuallyHR: true
                            })
                            wx.showToast({
                                icon: "none",
                                title: '设置失败',
                            })
                            qbBLEManager.isOpenRealtimeData(false);
                        }
                        break;
                    case bluetoothApi.kGXYL_RealtimeIsOpen:
                        if (body.realtimeData != null) {
                            if (body.realtimeData.hrRealtime == 255) {
                                qbBLEManager.isOpenRealtimeData(false);
                                body.realtimeData.hrRealtime = 0;
                                self.setData({
                                    isManuallyHR: true
                                })
                            }
                            self.setData({
                                hr_realtimeValue: body.realtimeData.hrRealtime
                            });
                        }
                        break;


                    case bluetoothApi.kGXYL_HRAutomaticallIsOpen:

                        if (body.setState == '设置成功') {
                            const state = !self.data.isAutoHR
                            self.setData({
                                isAutoHR: state
                            })
                        } else {
                            self.setData({
                                isAutoHR: true
                            })
                            wx.showToast({
                                icon: "none",
                                title: '设置失败',
                            })
                        }
                        break;

                    case bluetoothApi.kGXYL_GetManuallyLaserState:
                        console.log(body.manuallyLaserState, "获取激光开启状态")
                        if (body.manuallyLaserState + "" == "0") {
                            self.setData({
                                isManuallyLaser: true
                            })
                        } else {
                            self.setData({
                                isManuallyLaser: false
                            })
                        }
                        qbBLEManager.getAutoHRState();
                        break;

                    case bluetoothApi.kGXYL_GetAutoHRState:
                        console.log(body.autoHRState, "自动心率");
                        if (body.autoHRState + "" == "0") {
                            self.setData({
                                isAutoHR: true
                            })
                        } else if (body.autoHRState + "" == "1") {
                            self.setData({
                                isAutoHR: false
                            })
                        }
                        qbBLEManager.getManuallyHRState();
                        break;

                    case bluetoothApi.kGXYL_GetManuallyHRState:
                        console.log(body.manuallyHRState, "手动心率");
                        if (body.manuallyHRState + "" == "0") {
                            self.setData({
                                isManuallyHR: true
                            })
                        } else {
                            self.setData({
                                isManuallyHR: false
                            })
                            qbBLEManager.isOpenRealtimeData(true);
                        }
                        break;
                    default:
                        break;
                }
            }
        })
    },
})