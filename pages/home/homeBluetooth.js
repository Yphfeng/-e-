
const qbBLEManager = require('../../bluetooth/manager.js');
const bluetoothApi = require('../../bluetooth/api');
const transceiver = require('../../bluetooth/transceiver').transceiver;
const transceiverObject = new transceiver();
const qbBLEQRCode = require('../../bluetooth/qrCode.js');
const qbDate = require('../../common/qbDate.js');
const mineService = require('../../common/newService/mineService');
const errorLog = require('errorLog.js');
const courseService = require('../../common/newService/courseService');

var deviceInfo;
const app = getApp();
var myTimeout;
var isFirstInfo;
var getEQEvent = false;
const deviceNames = [
  "HA01CW", "HA01CD",
  "HA05AW", "HA05AD",
  "HA06AW", "HA06AD",
  "HA01A", "HA051W",'HA01AS']

function decodeBluetoothIdentify(identify) {

  var qr_data = new Array();
  qr_data[0] = identify.substring(0, 1).charCodeAt();
  qr_data[1] = identify.substring(1, 2).charCodeAt();
  qr_data[2] = parseInt(identify.substring(2, 4));
  var dateInt = parseInt(identify.substring(4, 12));
  qr_data[3] = dateInt % 256;
  qr_data[4] = parseInt((dateInt % 0x10000) / 0x100);
  qr_data[5] = parseInt((dateInt % 0x1000000) / 0x10000);
  qr_data[6] = parseInt(dateInt / 0x1000000);
  var num = parseInt(identify.substring(12, 16), 16);
  qr_data[7] = num % 256;
  qr_data[8] = num >> 8;
  return qr_data;
}

function compareArray(a1, a2) {

  if (a1 instanceof Array && a2 instanceof Array) { } else { return false }
  if (a1.length != a2.length) { return false; }
  if (a1.sort().toString() == a2.sort().toString()) { return true } else { return false }
}

/******************** 事件模块 ********************/

function onBLE(self, callBackDic) {

  qbBLEManager.notificationBluetoothAdapter(function (res) {

    if (callBackDic != null) {
      if (typeof callBackDic.onBLEAdapterCallBack == 'function') {
        callBackDic.onBLEAdapterCallBack(res);
        return;
      }
    }
    if (res.available == false) {
      wx.showToast({
        title: '蓝牙未开启',
      })
      deviceInfo = app.getDeviceInfo();
      deviceInfo.isConnect = false;
      deviceInfo.isShowDisconnectButton = false;
      app.setDeviceInfo(deviceInfo);
      self.setData({
        isShowDisconnectButton: false
      })
      isOpenBLEAdapter(false, function (res) { })
    }
  });

  qbBLEManager.notificationBluetoothSearchDevice(function (res) {

    var device = res.devices[0];
    if (device.localName != undefined) {

      console.debug("deviceLocalName_ 1");
      deviceNames.forEach((deviceName) => {

        if (deviceName == device.localName) {

          var bluetoothAdverData = new Uint8Array(device.advertisData);
          var result = qbBLEQRCode.resolvingBroadcastInformation(bluetoothAdverData);

          if (result != false) { 

            if (callBackDic != null) {
              if (typeof callBackDic.onBLESearchDevicesCallBack == 'function') {

                callBackDic.onBLESearchDevicesCallBack({ 
                  deviceIdentificationCode: result,
                  deviceName: device.localName
                });
              } else {

                return;
              }
            } else {

              deviceInfo = app.getDeviceInfo();
              if (deviceInfo.deviceIdentificationCode == result) {

                connectPeripheral(device, self);
              } else {
                errorLog.update('设备不符合用户设备', false);
                console.debug('res3', "设备不符合");
              }
            }
          }
        }
      });
    } else if (device.name != undefined) {

      console.debug("deviceName_ 1");
      deviceNames.forEach((deviceName) => {

        if (deviceName == device.name) {

          console.debug("deviceName_ 2");
          var bluetoothAdverData = new Uint8Array(device.advertisData);
          var result = qbBLEQRCode.resolvingBroadcastInformation(bluetoothAdverData);
          if (result != false) {
            console.debug("deviceName_ 3");

            if (callBackDic != null) {

              if (typeof callBackDic.onBLESearchDevicesCallBack == 'function') {
                console.debug("deviceName_ 4");
                callBackDic.onBLESearchDevicesCallBack({
                  deviceIdentificationCode: result,
                  deviceName: device.name
                });
              } else {
                console.debug("deviceName_ 6");
              }
            } else {
              console.debug("deviceName_ 5");
              deviceInfo = app.getDeviceInfo();
              if (deviceInfo.deviceIdentificationCode == result) {

                connectPeripheral(device, self);
              } else {
                errorLog.update('设备不符合用户设备', false);
                console.debug('res3', "设备不符合");
              }
            }
          } else {
            console.debug("deviceName_ 10");
          }
        }
      })
    }
  });

  transceiverObject.receiveMessage(function (item) {

    if (callBackDic != null) {
      if (typeof callBackDic.receiveMessageCallBack == 'function') {
        callBackDic.receiveMessageCallBack(item);
        return;
      }
    }
    receiveBLEData(item, self);
  });
}

function beginSearchPeripheral(self) {

  if (self.data.isExistsDeviceInCache == false) {
    wx.showToast({
      icon: 'none',
      title: '请先绑定设备',
    })
  }
  deviceInfo = app.getDeviceInfo();
  if (deviceInfo.isConnect == true) {
    errorLog.update('用户进入小程序时，已有设备连接', false);
    deviceInfo.isConnect = false;
    deviceInfo.isShowDisconnectButton = false;
    app.setDeviceInfo(deviceInfo);
    isOpenBLEAdapter(true, function () {
      isOpenBLEAdapter(false, function () {
        wx.showModal({
          title: '请重新开启手机蓝牙',
          content: '',
        })
      });
    });
  } else {
    isOpenBLEAdapter(false, function () {
      isOpenBLEAdapter(true, function () {
        wx.showLoading({
          title: '正在搜索...',
          mask: true,
        })
        myTimeout = setTimeout(function () { 
          isStartSearchDevice(false);
          wx.hideLoading();
          wx.showModal({
            title: '未找到你的治疗仪',
            content: "解决方法：1、判断是否激活治疗仪；2、判断当前使用的治疗仪与绑定的治疗仪是否一致；3、重新开启手机蓝牙；4、退出小程序重新进入；5、删除当前小程序重新安装最新的“ 分享E疗 ”小程序；6、Android6.0系统以上需要打开定位功能",
          })
        }, 10000);
        isStartSearchDevice(true); 
      });
    });
    return
  }
}

function disconnectDeviceEvent(self) {

  errorLog.update('断开事件', false);
  qbBLEManager.isOpenRealtimeData(false);
  setTimeout(function () {

    deviceInfo = app.getDeviceInfo();
    qbBLEManager.isConnectPeripheral(false, deviceInfo.device, function () {
      wx.closeBluetoothAdapter({
        success: function (res) {
          if (res.errMsg == 'closeBluetoothAdapter:ok') {
            deviceInfo = app.getDeviceInfo();
            deviceInfo.isConnect = false;
            deviceInfo.isShowDisconnectButton = false;
            app.setDeviceInfo(deviceInfo);
            self.setData({
              isShowDisconnectButton: false,
              hr_realtimeValue: 0
            })
            wx.showToast({ title: '设备已断开', })
          } else {
            console.log(res);
          }
        },
      })
    })
  }, 800);
}


function connectPeripheral(device, self) {

  wx.showLoading({
    title: '正在连接...',
    mask: false,
  })
  console.log(device);
  qbBLEManager.isConnectPeripheral(true, device, function () {

    clearTimeout(myTimeout);
    errorLog.update('连接成功', false);
    var device_sn = app.getDeviceInfo().deviceIdentificationCode;
    console.log(device_sn);
    mineService.lastConnectTime({device_sn:device_sn},function(res){

    },function(err){

    })
    self.setData({
      isShowDisconnectButton: true,
      hr_realtimeValue: 0
    })
    deviceInfo = app.getDeviceInfo();
    deviceInfo.device = device;
    deviceInfo.isConnect = true;
    deviceInfo.isShowDisconnectButton = true;
    app.setDeviceInfo(deviceInfo);
    errorLog.update('开始配置', false);
    wx.showLoading({
      title: '正在配置...',
      mask: true
    })
    myTimeout = setTimeout(function () {
      errorLog.update('配置超时', true);
      clearTimeout(myTimeout);
      wx.hideLoading();
      wx.showModal({
        title: '配置超时',
        content: '是否重新配置',
        success: function (res) {
          if (res.confirm) {
            errorLog.update('重新配置', false);
            errorLog.update('同步时间', false);
            qbBLEManager.sycnTime();
          }
        }
      })
    }, 60000);
    errorLog.update('同步时间', false);
    qbBLEManager.sycnTime();
  }, function () {
    clearTimeout(myTimeout);
    wx.hideLoading();
    wx.showToast({
      icon: 'none',
      title: '连接治疗仪失败',
    })
  })
}

function getFirstConnectDevice(complete) {

  courseService.getFistConnectTreatmentInfo({
    device_sn: app.getDeviceInfo().deviceIdentificationCode
  }, function (res) {
    complete(res.data);
  }, function (err) {
    errorLog.update('获取是否第一次连接网络错误', true);
    errorLog.update(err, true);
    clearTimeout(myTimeout);
    wx.hideLoading();
    wx.showModal({
      title: '配置失败',
      content: "网络错误10001",
      showCancel: false
    })
  })
}

function setFirstConnectDevice() {

  errorLog.update('向设备写入成功，设置第一次连接的状态', false);
  courseService.setFirstConnectTreatmentInfo({
    device_sn: app.getDeviceInfo().deviceIdentificationCode,
    course_id: isFirstInfo.course_id,
    give_status: isFirstInfo.give_status
  }, function (res) {
    clearTimeout(myTimeout);
    wx.hideLoading();
    wx.showToast({
      title: '配置完成',
    });
  }, function (err) {
    clearTimeout(myTimeout);
    wx.hideLoading();
    wx.showToast({
      title: '配置完成',
    });
  });
}

function updateCourseDays(remainingDays, course_sn, complete, fail) {

  deviceInfo = app.getDeviceInfo();
  courseService.updateCourseDays({ 
    device_sn: deviceInfo.deviceIdentificationCode,
    remaining_days: remainingDays,
    course_sn: course_sn
  }, complete, fail);
}


/**
 * 获取蓝牙适配器状态
 */
function getBLEAdapterState(complete) {
  qbBLEManager.getBluetoothAdapterState(complete);
}
// 是否开启蓝牙适配器
function isOpenBLEAdapter(isOpen, complete) {
  qbBLEManager.isOpenBluetooth(isOpen, complete);
}
// 是否开启搜索
function isStartSearchDevice(isStart) {
  setTimeout(function () {
    qbBLEManager.isStartSearchPeripheral(isStart);
  }, 500);
}
function isStartSearchDevice1(isStart) {
  setTimeout(function () {
    qbBLEManager.isStartSearchPeripheral1(isStart);
  }, 500);
}
/**
 * 获取设备信息
 */
function getDeviceInfo() {
  qbBLEManager.getDeviceInfo();
}

/**
 * 设置ebivalue
 */
function setEbiValue(ebi) {

  var _minute = parseInt(parseFloat(ebi).toFixed(2) * 100);
  console.log(_minute);
  if (_minute == 0) {
    _minute = 1;
  }
  qbBLEManager.setLaserManuallyPaymentDuration(_minute);
}

function getEQ() {

  getEQEvent = true
  qbBLEManager.getEQ();
}

/**
 * 设置手动参数
 */
function setManuallyParameters() {

  qbBLEManager.setLaserManuallyParameters(4, 24);
}

/**
 * 设置疗程参数
 */
function setTreatmentParamenters() {

  if (isFirstInfo == null) {
    console.debug('第一次连接没有疗程参数');
    return;
  }
  var parametersArray = [];
  isFirstInfo.parameter_list.forEach(v => {
    let item = {
      power: parseInt(v.power_level),
      duration: parseInt(v.start_duration),
      startHour: parseInt(v.start_time.split(":")[0]),
      startMinute: parseInt(v.start_time.split(":")[1]),
    }
    parametersArray.push(item);
  })

  let courseNumber = parseInt(isFirstInfo.course_data.course_type_sn);
  let coursePeriodic = parseInt(isFirstInfo.course_data.course_cycle_work_days);
  let courseGap = parseInt(isFirstInfo.course_data.course_cycle_rest_days);
  let courseEndDate = qbDate.getNewDay(isFirstInfo.remaining_days).split('-');
  const dic = {
    index: courseNumber, 
    periodic: coursePeriodic,  
    gap: courseGap, 
    endDate: courseEndDate, 
    parameters: parametersArray 
  }

  qbBLEManager.setLaserTreatmentParameters(dic)
}



/***************************************** 分发模块 ************************/
/**
 * 监听数据回收处理
 */
function receiveBLEData(item, self) {

  // 判断当前视图是否隐藏
  var body = item.body;
  switch (item.cmd) {
    case bluetoothApi.kGXYL_LaserIsOpen:
    case bluetoothApi.kGXYL_setPointer:     
    case bluetoothApi.kGXYL_HRAutomaticallIsOpen:
      if (body.setState != '设置成功') {
        errorLog.update("设置心率自动开启：" + body.setState, true);
      }
      wx.showToast({ title: body.setState });
      break;
    case bluetoothApi.kGXYL_HRManuallyIsOpen: 

      wx.showToast({ title: body.setState });
      if (body.setState == '设置成功') {
        qbBLEManager.isOpenRealtimeData(true);
      } else {
        errorLog.update("设置心率手动开启：" + body.setState, true);
        qbBLEManager.isOpenRealtimeData(false);
      }
      break;
    case bluetoothApi.kGXYL_RealtimeIsOpen:
      if (body.realtimeData != null) {

        if (body.realtimeData.hrRealtime == 255) {
          qbBLEManager.isOpenRealtimeData(false);
          body.realtimeData.hrRealtime = 0;
        }
        self.setData({
          hr_realtimeValue: body.realtimeData.hrRealtime
        });
      }
      break;
    case bluetoothApi.kGXYL_TimeSync:
      if (body.setState == '设置成功') {
        errorLog.update('同步时间成功，正在获取电量', false);
        qbBLEManager.getEQ();
      } else {
        errorLog.update('配置失败:同步时间失败', true);
        clearTimeout(myTimeout);
        wx.hideLoading();
        wx.showModal({
          title: '配置失败',
          content: "同步时间：" + body.setState,
          showCancel: false
        })
      }
      break;
    case bluetoothApi.kGXYL_GetEQ: 

      self.setData({
        deviceEQ: body.eq
      });
      deviceInfo = app.getDeviceInfo();
      deviceInfo.EQ = body.eq;
      app.setDeviceInfo(deviceInfo);
      if (getEQEvent) { 
        getEQEvent = false;
      } else {
        getDeviceInfo();
      }
      break;
    case bluetoothApi.kGXYL_GetDeviceInfo: 
      self.setData({
        firmwareVersion: body.deviceInfo.firmwareVersion
      })
      getFirstConnectDevice(function (info) {
        console.log(info);
        if (info.give_status + '' == "1" || info.give_status + '' == "2") { 
          isFirstInfo = info;
          setEbiValue(info.eb);
        } else {
          qbBLEManager.getLaserTreatmentParameters();
        }
      });
      break;
    case bluetoothApi.kGXYL_GetLaserRegimenParameters: 
      console.log(body,"--------------");
      var _remainingDays = 0;
      if (body.treatmentDurationType == '0') {
        _remainingDays = body.remainingDays;
      } else if (body.treatmentDurationType == "1") {
        const newDate = new Date();
        const todayString = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate();
        _remainingDays = qbDate.dateDiff(todayString, body.endDate);
      }
      updateCourseDays(_remainingDays, body.sequence, function (res) {
        clearTimeout(myTimeout);
        wx.hideLoading();
        wx.showToast({ title: '配置完成', });
      }, function (err) {
        clearTimeout(myTimeout);
        wx.hideLoading();
        wx.showToast({ title: '配置完成', });
      });
      break;
    case bluetoothApi.kGXYL_LaserManuallyPayParameters:
      if (body.setState == '设置成功') {
        setManuallyParameters(); 
      } else {
        errorLog.update('配置失败:写入E币数据失败,' + body.setState, true);
        clearTimeout(myTimeout);
        wx.hideLoading();
        wx.showModal({
          title: '配置失败',
          content: "配置E币失败_1：" + body.setState,
          showCancel: false
        })
      }
      break;
    case bluetoothApi.kGXYL_LaserManuallyParameters:
      if (body.setState == '设置成功') {
        setTreatmentParamenters();
      } else {
        errorLog.update('写入激光参数失败，' + body.setState, true);
        clearTimeout(myTimeout);
        wx.hideLoading();
        wx.showModal({
          title: '配置失败',
          content: "配置E币失败_2：" + body.setState,
          showCancel: false
        })
      }
      break;
    case bluetoothApi.kGXYL_LaserRegimenParameters:

      if (body.setState == '设置成功') {
        setFirstConnectDevice();
      } else {
        errorLog.update('向设备写入疗程参数失败，' + body.setState, true);
        clearTimeout(myTimeout);
        wx.hideLoading();
        wx.showModal({
          title: '配置失败',
          content: "设置疗程参数信息失败：" + body.setState,
          showCancel: false
        })
      }
      break;
    case bluetoothApi.kGXYL_GetLaserManuallyParameters:

      let deviceEbi = parseFloat(parseInt(body.duration) / 100).toFixed(2);
      if (deviceEbi > 0.00) {
        qbBLEManager.isOpenLaserAction(true);
        mineService.updateUserDeviceEBi(deviceEbi, function (res) { }, function (err) { })
      } else {
        wx.showModal({
          title: '开启失败',
          content: '设备中的e币不足,请充值',
        })
        self.setData({
          isLaserState: false
        })
      }
      break;
    default:
      break;
  }
}

module.exports = {
  getBLEAdapterState: getBLEAdapterState,
  isOpenBLEAdapter: isOpenBLEAdapter,
  isStartSearchDevice: isStartSearchDevice,
  isStartSearchDevice1: isStartSearchDevice1,
  getEQ: getEQ,
  onBLE: onBLE,
  beginSearchPeripheral: beginSearchPeripheral,
  disconnectDeviceEvent: disconnectDeviceEvent
}