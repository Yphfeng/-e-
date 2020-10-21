
// var deviceInfoServiceId = "0000180A-0000-1000-8000-00805F9B34FB";
let dataServiceId = "9C2C4841-69C3-4742-9F69-764351FB0783";
let readCharacteristic = "9C2C485A-69C3-4742-9F69-764351FB0783";
let writeCharacteristicId = "9C2C48A5-69C3-4742-9F69-764351FB0783";

let errorLog = require('../pages/home/errorLog.js');

let app = getApp();
var currentDeviceId;
var currentDataServiceId;
var currentReadCharacteristic;
var currentWriteCharacteristicId;

function isOpenBluetooth(isOpen, complete) {
  console.log("是不是开启的",isOpen);

  if (isOpen == true) {
    wx.openBluetoothAdapter({
      success: function (res) {
        console.debug('打开蓝牙适配器', res);
        complete();
      },
      fail: function (res) {
        console.debug('fail', res);
        res.stepString = '打开蓝牙适配器失败';
        errCodeShow(res);
        complete(res);
      }
    })
  } else {
    wx.closeBluetoothAdapter({
      success: function (res) {
        console.debug('关闭蓝牙适配器', res)
        complete();
      },
      fail: function (res) {
        res.stepString = '关闭蓝牙适配器失败';
        errCodeShow(res);
        complete();
      }
    })
  }
}

function errCodeShow(res) {

  errorLog.update(res, true);
  console.debug(res);
  const systemInfo = wx.getSystemInfoSync();
  var errCode = 0;
  if (res.errMsg.length == 65) {
    errCode = parseInt(res.errMsg.split('=')[1].split(';')[0]);
  } else {
    errCode = parseInt(res.errCode);
  }
  console.log(errCode, '是不是断开了')
  switch (errCode) {
    case 10001:
    wx.showToast({ title: '请先开启手机蓝牙',  });
    break;
    case 10009:
      wx.showModal({
        title: '不支持蓝牙',
        content: 'Android系统版本低于4.3',
      })
      break;
    case 10000:
    case 10006:
      wx.showToast({ title: '设备已断开', })
      break;
    case 10003:

      break;
    default:
      break;
  }
}

function getBluetoothAdapterState(complete) {

  wx.getBluetoothAdapterState({
    success: function (res) {
      complete(res);
    },
    fail: function (res) {
      complete(res);
    },
    complete: function (res) { },
  })
}

function notificationBluetoothState(change) {

  wx.onBluetoothAdapterStateChange(change);
}

function isStartSearchPeripheral(isStart) {

  if (isStart == true) {
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        console.debug('center开始搜索设备', res)
      },
      fail: function(res) {
        console.debug("center开始搜索失败",res);
      }
    })
  } else {
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.debug('关闭搜索设备', res)
      },
    })
  }
}
//重复搜索
function isStartSearchPeripheral1(isStart) {

  if (isStart == true) {
    wx.startBluetoothDevicesDiscovery({ allowDuplicatesKey: true }, {
      success: function (res) {
        console.debug('center开始搜索设备', res)
      },
      fail: function (res) {
        console.debug("center开始搜索失败", res);
      }
    })
  } else {
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.debug('关闭搜索设备', res)
      },
    })
  }
}

function getConnectedBluetoothDevices(success) {

  wx.getConnectedBluetoothDevices({
    services: [dataServiceId],
    success: function (res) {

      success(res);
    },
    fail: function(err) {
      success();
    }
  })
}

function notificationBluetoothSearchDevice(found) {
  console.debug("center监听搜索到的设备事件");
  wx.onBluetoothDeviceFound(found);
}

function isConnectPeripheral(isConnect, device, success, fail) {

  currentDeviceId = device.deviceId;
  if (isConnect == true) {

    isStartSearchPeripheral(false);

    setTimeout(function(){

      wx.createBLEConnection({
        deviceId: currentDeviceId,
        success: function (res) {

          console.debug("createBLEConnection");
          console.debug(res.errMsg, res.errCode);
          if (res.errMsg == 'createBLEConnection:ok') {


            setReadCharaNotify(success, fail);
          } else {
            console.debug(res.errMsg, "连接设备失败1");
            res.stepString = '连接设备失败1';
            errCodeShow(res);;
            fail(res);
          }
        },
        fail: function (res) {
          console.debug(res.errMsg, res.errCode, "连接设备失败2");
          res.stepString = '连接设备失败2';
          errCodeShow(res);
          wx.closeBLEConnection({
            deviceId: device.deviceId,
            success: function (res) {

            },
            fail: function (res) {
              res.stepString = '断开设备失败4';
              errCodeShow(res);
              fail();
            },
            complete: function (res) { },
          })
        }
      })
    }, 1000)
  } else {
    wx.closeBLEConnection({
      deviceId: device.deviceId,
      success: function (res) {

        if (res.errMsg == 'closeBLEConnection:ok') {
          success();
        } else {
          errorLog.update('断开设备失败1' + res.errMsg, true);
          fail();
        }
      },
      fail: function (res) {
        res.stepString = '断开设备失败2';
        errCodeShow(res);
        fail();
      },
      complete: function (res) { },
    })
  }
}


function notificationBluetoothConnectError(error) {

  wx.onBLEConnectionStateChange(function (res) {
    error(res);
  })
}

function writeDataToBluetoothDevice(values) {

  if (app.getDeviceInfo().device == undefined) {
    wx.hideLoading();
    wx.showToast({
      title: '请先连接设备',
    })
    return
  }
  wx.writeBLECharacteristicValue({
    deviceId: currentDeviceId,
    serviceId: currentDataServiceId,
    characteristicId: currentWriteCharacteristicId,
    value: values,
    success: function (res) {

    }, fail: function (res) {
      res.stepString = '向蓝牙写数据失败';
      errCodeShow(res);
    }
  })
}


function notificationBluetoothCharacteristicsValueChange(callBack) {

  wx.onBLECharacteristicValueChange(function (res) {
    callBack(res);
  })
}


function setReadCharaNotify(success, fail) {


  wx.getBLEDeviceServices({
    deviceId: currentDeviceId,
    success: function (res) {

      if (res.errMsg == 'getBLEDeviceServices:ok') {

        res.services.forEach((service) => {
          if (service.uuid.toUpperCase() == dataServiceId) {
            currentDataServiceId = service.uuid;
          }
        })
        
        wx.getBLEDeviceCharacteristics({
          deviceId: currentDeviceId,
          serviceId: currentDataServiceId,
          success: function (res) {

            if (res.errMsg == 'getBLEDeviceCharacteristics:ok') {

              res.characteristics.forEach((chara) => {
                if (chara.uuid.toUpperCase() == readCharacteristic) {
                  currentReadCharacteristic = chara.uuid;
                } else if (chara.uuid.toUpperCase() == writeCharacteristicId) {
                  currentWriteCharacteristicId = chara.uuid;
                }
              })

              wx.notifyBLECharacteristicValueChange({
                deviceId: currentDeviceId,
                serviceId: currentDataServiceId,
                characteristicId: currentReadCharacteristic,
                state: true,
                success: function (res) {
                  if (res.errMsg == 'notifyBLECharacteristicValueChange:ok') {

                    wx.setStorageSync('pktCount', 0);
                    success();
                  } else {

                    res.stepString = '订阅特性失败';
                    errCodeShow(res);
                    fail();
                  }
                },
                fail: function (res) {

                  res.stepString = '订阅特性失败';
                  errCodeShow(res);
                  fail();
                }
              })
            } else {
              res.stepString = '获取特性失败';
              errCodeShow(res);
              fail();
            }
          },
          fail: function (res) {
            res.stepString = '获取特性失败';
            errCodeShow(res);
            fail();
          }
        })
      } else {
        errorLog.update('获取设备服务失败' + res.errMsg, true);
        fail();
      }
    },
    fail: function (res) {
      console.debug("获取设备服务失败");
      console.debug(res.errMsg);
      res.stepString = '获取设备服务失败';
      errCodeShow(res);
      fail();
    }
  })
}

module.exports = {

  isOpenBluetooth: isOpenBluetooth,
  getBluetoothAdapterState: getBluetoothAdapterState,
  notificationBluetoothState: notificationBluetoothState,
  isStartSearchPeripheral: isStartSearchPeripheral,
  isStartSearchPeripheral1:isStartSearchPeripheral1,
  isConnectPeripheral: isConnectPeripheral,
  getConnectedBluetoothDevices: getConnectedBluetoothDevices,
  notificationBluetoothSearchDevice: notificationBluetoothSearchDevice,
  notificationBluetoothConnectError: notificationBluetoothConnectError,
  notificationBluetoothCharacteristicsValueChange: notificationBluetoothCharacteristicsValueChange,
  writeDataToBluetoothDevice: writeDataToBluetoothDevice
}
