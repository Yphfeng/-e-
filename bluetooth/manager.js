
var bleCenter = require('../bluetooth/center');
var transceiver = require('../bluetooth/transceiver').transceiver;
var bluetoothApi = require('api');
var transceiverObject = new transceiver();

function isOpenBluetooth(isOpen, complete) {

  bleCenter.isOpenBluetooth(isOpen, complete);
}


function getBluetoothAdapterState(complete) {

  bleCenter.getBluetoothAdapterState(complete)
}


function notificationBluetoothAdapter(change) {

  bleCenter.notificationBluetoothState(change)
}


function isStartSearchPeripheral(isStart) {

  bleCenter.isStartSearchPeripheral(isStart)
}
function isStartSearchPeripheral1(isStart) {

  bleCenter.isStartSearchPeripheral1(isStart)
}


function notificationBluetoothSearchDevice(foundDevices) {

  bleCenter.notificationBluetoothSearchDevice(function(res){
    console.debug("manager监听到的设备", res);
    foundDevices(res);
  });
}

function isConnectPeripheral(isConnect, device, success, fail) {

  bleCenter.isConnectPeripheral(isConnect, device, success, fail)
}

function getConnectedBluetoothDevices(callBack) {
  
  bleCenter.getConnectedBluetoothDevices(callBack)
}


//系统时间同步
function sycnTime() {
  var timestamp = parseInt(new Date().getTime() / 1000 - 1483200000);
  var timeBuffer = new ArrayBuffer(4);
  var timeDataView = new DataView(timeBuffer);
  //位运算符存取
  timeDataView.setUint8(0, timestamp & 0x000000FF);
  timeDataView.setUint8(1, (timestamp & 0x0000FF00) >> 8);
  timeDataView.setUint8(2, (timestamp & 0x00FF0000) >> 16);
  timeDataView.setUint8(3, (timestamp & 0xFF000000) >> 24);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_TimeSync, timeDataView);
}

//获取电量
function getEQ() {

  var timeBuffer = new ArrayBuffer(0);
  var dataView = new DataView(timeBuffer);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_GetEQ, dataView);
}


//恢复出厂模式
function restoreFactorySettings() {

  var timeBuffer = new ArrayBuffer(0);
  var dataView = new DataView(timeBuffer);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_RestoreFactorySettings, dataView);
}

//获取设备信息
function getDeviceInfo() {

  var timeBuffer = new ArrayBuffer(0);
  var dataView = new DataView(timeBuffer);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_GetDeviceInfo, dataView);
}

//石英时间校准
function setPointer(dic) {

  var timeBuffer = new ArrayBuffer(3);
  var dataView = new DataView(timeBuffer);
  if (dic.type + '' == "1" && dic.hour + '' != "null" && dic.minute + '' != "null") {

    dataView.setInt8(0, parseInt(dic.type));
    dataView.setUint8(1, parseInt(dic.hour));
    dataView.setInt8(2, parseInt(dic.minute));
  } else if (dic.type + '' == "0" && dic.sec + '' != "null") {
    dataView.setInt8(0, parseInt(dic.type));
    dataView.setUint8(1, parseInt(dic.value % 256));
    dataView.setInt8(2, parseInt(dic.value / 256) );
  }

  transceiverObject.sendMessage(bluetoothApi.kGXYL_setPointer, dataView);
}

//激光是否开启
function isOpenLaserAction(isOpen) {

  var buffer = new ArrayBuffer(1);
  var dataView = new DataView(buffer);
  isOpen == true ? dataView.setUint8(0, 1) : dataView.setUint8(0, 0);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_LaserIsOpen, dataView);
}

//获取最新手动参数
function getLaserManuallyParameters() {

  var timeBuffer = new ArrayBuffer(0);
  var dataView = new DataView(timeBuffer);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_GetLaserManuallyParameters, dataView);
}
//激光手动输出参数
function setLaserManuallyParameters(power, duration) {

  var timeBuffer = new ArrayBuffer(2);
  var dataView = new DataView(timeBuffer);
  dataView.setUint8(0, power);
  dataView.setUint8(1, duration);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_LaserManuallyParameters, dataView);
}

//获取手动激光状态
function getManuallyLaserState() {

  var timeBuffer = new ArrayBuffer(0);
  var dataView = new DataView(timeBuffer);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_GetManuallyLaserState, dataView);
}

//手动激光付费参数
function setLaserManuallyPaymentDuration(duration) {

  var timeBuffer = new ArrayBuffer(4);
  var dataView = new DataView(timeBuffer);
  dataView.setUint8(0, duration & 0x000000FF);
  dataView.setUint8(1, (duration & 0x0000FF00) >> 8);
  dataView.setUint8(2, (duration & 0x00FF0000) >> 16);
  dataView.setUint8(3, (duration & 0xFF0000FF) >> 24);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_LaserManuallyPayParameters, dataView);
}
//获取激光疗程参数
function getLaserTreatmentParameters() {

  var dataBuffer = new ArrayBuffer(0)
  var dataView = new DataView(dataBuffer);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_GetLaserRegimenParameters, dataView);
}

//设置激光疗程参数
function setLaserTreatmentParameters(treatment) {
console.log(treatment)
  var length = treatment.parameters.length * 4 + 8;
  var dataBuffer = new ArrayBuffer(length);
  var dataView = new DataView(dataBuffer);

  var parameterArray = treatment.parameters;

  dataView.setUint8(0, treatment.index);

  dataView.setUint8(1, parameterArray.length);

  dataView.setUint8(2, treatment.periodic);

  dataView.setUint8(3, treatment.gap);
  
  if (treatment.endDate != undefined) {

    const year = parseInt(treatment.endDate[0]);
    dataView.setUint8(4, year % 256);
    dataView.setUint8(5, year / 256);
    dataView.setUint8(6, parseInt(treatment.endDate[1]));
    dataView.setUint8(7, parseInt(treatment.endDate[2]));
  } else {
    console.debug("疗程天数出错")
    return
  }

  parameterArray.forEach((parameter, index) => {
    dataView.setUint8(8 + index * 4 + 0, parameter.power);
    dataView.setUint8(8 + index * 4 + 1, parameter.duration);
    dataView.setUint8(8 + index * 4 + 2, parameter.startHour);
    dataView.setUint8(8 + index * 4 + 3, parameter.startMinute);
  })
  
  transceiverObject.sendMessage(bluetoothApi.kGXYL_LaserRegimenParameters, dataView);
}

//获取激光治疗数据
function getLaserData(year, month, day, startIndex, length) {

  if (year == undefined || month == undefined || day == undefined) {
    return
  }
  var startIndex1 = startIndex || 0;
  var length1 = length || 100;

  var buffer = new ArrayBuffer(6);
  var dataView = new DataView(buffer);
  dataView.setUint8(0, parseInt(year % 256));
  dataView.setUint8(1, parseInt(year / 256));
  dataView.setUint8(2, parseInt(month));
  dataView.setUint8(3, parseInt(day));
  dataView.setUint8(4, parseInt(startIndex1));
  dataView.setUint8(5, parseInt(length1));
  transceiverObject.sendMessage(bluetoothApi.kGXYL_GetLaserRecording, dataView);
}
//开关心率监测
function isOpenHrAction(isOpen) {

  var buffer = new ArrayBuffer(1);
  var dataView = new DataView(buffer);
  isOpen ? dataView.setUint8(0, 1) : dataView.setUint8(0, 0);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_HRManuallyIsOpen, dataView);
}
//判断是否开启自动心率监测
function isOpenAutoHrAction(isOpen) {

  var buffer = new ArrayBuffer(1);
  var dataView = new DataView(buffer);
  isOpen == true ? dataView.setUint8(0, 1) : dataView.setUint8(0, 0);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_HRAutomaticallIsOpen, dataView);
}

//开启实时步数心率值
function isOpenRealtimeData(isOpen) {

  var buffer = new ArrayBuffer(1);
  var dataView = new DataView(buffer);
  isOpen ? dataView.setUint8(0, 1) : dataView.setUint8(0, 0);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_RealtimeIsOpen, dataView);
}

//获取心率开关状态
function getManuallyHRState() {

  var timeBuffer = new ArrayBuffer(0);
  var dataView = new DataView(timeBuffer);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_GetManuallyHRState, dataView);
}

//获取心率自动参数
function getAutoHRState() {

  var timeBuffer = new ArrayBuffer(0);
  var dataView = new DataView(timeBuffer);
  transceiverObject.sendMessage(bluetoothApi.kGXYL_GetAutoHRState, dataView);
}

//获取心率监测记录
function getHrData(year, month, day, startIndex, length) {

  if (year == undefined || month == undefined || day == undefined) {
    return
  }
  var startIndex1 = startIndex || 0;
  var length1 = length || 100;

  var buffer = new ArrayBuffer(6);
  var dataView = new DataView(buffer);
  dataView.setUint8(0, parseInt(year % 256));
  dataView.setUint8(1, parseInt(year / 256));
  dataView.setUint8(2, parseInt(month));
  dataView.setUint8(3, parseInt(day));
  dataView.setUint8(4, parseInt(startIndex1));
  dataView.setUint8(5, parseInt(length1));
  transceiverObject.sendMessage(bluetoothApi.kGXYL_GetHRRecording, dataView);
}

function getMotionData(year, month, day) {
  console.log('获取运动数据')

  if (year == undefined || month == undefined || day == undefined) {
    return
  }
  var buffer = new ArrayBuffer(4);
  var dataView = new DataView(buffer);
  dataView.setUint8(0, parseInt(year % 256));
  dataView.setUint8(1, parseInt(year / 256));
  dataView.setUint8(2, parseInt(month));
  dataView.setUint8(3, parseInt(day));

  transceiverObject.sendMessage(bluetoothApi.kGXYL_GetMotionRecording, dataView);
}



function isFunctionType(object) {

  if (typeof object != 'function') {
    return false;
  }
  return true;
}

module.exports = {

  isOpenBluetooth: isOpenBluetooth,
  getBluetoothAdapterState: getBluetoothAdapterState,
  notificationBluetoothAdapter: notificationBluetoothAdapter,
  isStartSearchPeripheral: isStartSearchPeripheral,
  isStartSearchPeripheral1: isStartSearchPeripheral1,
  notificationBluetoothSearchDevice: notificationBluetoothSearchDevice,
  isConnectPeripheral: isConnectPeripheral,
  getConnectedBluetoothDevices: getConnectedBluetoothDevices,
  getDeviceInfo: getDeviceInfo,
  setPointer: setPointer,

  sycnTime: sycnTime,
  getEQ: getEQ,
  restoreFactorySettings:
  restoreFactorySettings,

  isOpenHrAction: isOpenHrAction,
  isOpenRealtimeData: isOpenRealtimeData,
  getHrData: getHrData,
  isOpenAutoHrAction: isOpenAutoHrAction,

  isOpenLaserAction: isOpenLaserAction,
  getLaserTreatmentParameters: getLaserTreatmentParameters,
  setLaserTreatmentParameters: setLaserTreatmentParameters,
  getLaserManuallyParameters: getLaserManuallyParameters,
  setLaserManuallyParameters: setLaserManuallyParameters,
  setLaserManuallyPaymentDuration: setLaserManuallyPaymentDuration,
  getLaserData: getLaserData,

  getMotionData: getMotionData,

  getManuallyLaserState: getManuallyLaserState,
  getManuallyHRState: getManuallyHRState,
  getAutoHRState: getAutoHRState
}