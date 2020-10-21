var bleCoding = require('coding').coding
var bleCenter = require('center');
var bluetoothApi = require('../bluetooth/api');

var buffer = new ArrayBuffer(80);
var receiveDataU8 = new Uint8Array(buffer);
var receiveCacheArray = new Array();
var receiveIndex = 0;
var isReceiveData = true;

function transceiver() {

  this.coding = new bleCoding();

  this.sendMessage = function sendData(cmd, dataViewParameters) {
    var aesBuffer = this.coding.encoding(cmd, dataViewParameters);
    var aesDataView = new DataView(aesBuffer);
    const res = wx.getSystemInfoSync();

    var sendDataCount = 18;
    let totalDataCount = aesDataView.byteLength;
    const packetCount = parseInt((totalDataCount - 1) / sendDataCount + 1);

    if (res.platform == 'android') {
      var packetNum = 0;
      var myTinterval;
      myTinterval = setInterval(function () {

        var currentCount = (totalDataCount >= (packetNum + 1) * sendDataCount ? sendDataCount : totalDataCount - packetNum * sendDataCount)

        var sendBuffer = new ArrayBuffer(currentCount);
        var sendDataView = new DataView(sendBuffer);
        for (var index = 0; index < currentCount; index++) {
          
          sendDataView.setUint8(index, aesDataView.getUint8(index + packetNum * sendDataCount))
        }

        bleCenter.writeDataToBluetoothDevice(sendBuffer);

        packetNum += 1;
        if (packetNum >= packetCount) {
          clearInterval(myTinterval);
        }
      }, 500);
    } else {

      for (var packetNum = 0; packetNum < parseInt((totalDataCount - 1) / sendDataCount + 1); packetNum++) {

        var currentCount = (totalDataCount >= (packetNum + 1) * sendDataCount ? sendDataCount : totalDataCount - packetNum * sendDataCount);

        var sendBuffer = new ArrayBuffer(currentCount);
        var sendDataView = new DataView(sendBuffer);
        for (var index = 0; index < currentCount; index++) {
          sendDataView.setUint8(index, aesDataView.getUint8(index + packetNum * sendDataCount))
        }

        bleCenter.writeDataToBluetoothDevice(sendBuffer);
      }
    }
  }

  this.receiveMessage = function receiveData(callBack) {
    var that = this;

    bleCenter.notificationBluetoothCharacteristicsValueChange(function (res) {
      var dataU8 = new Uint8Array(res.value);
      console.log(dataU8);
      if (dataU8[0] == 165) {
        isReceiveData = true;
      }
      if (isReceiveData) {
        receiveDataU8.set(dataU8, receiveIndex);
        receiveIndex += dataU8.byteLength;
        if (receiveDataU8[1] == receiveIndex - 2) {
          isReceiveData = false;
        } else {  
          return;
        }
      } else { 
        return;
      }

      var data = receiveDataU8.slice(2, receiveIndex);
      receiveIndex = 0;
      let v = that.coding.decoding(data.buffer);
      dataDistributionMethods(v, function (v) {
        callBack(v);
      });
    })
  }


  var ASCIIDic = {
    38: "&", 48: "0", 49: "1", 50: "2",
    51: "3", 52: "4", 53: "5", 54: "6",
    55: "7", 56: "8", 57: "9", 65: "A",
    66: "B", 67: "C", 68: "D", 69: "E",
    70: "F", 71: "G", 72: "H", 73: "I",
    74: "J", 75: "K", 76: "L", 77: "M",
    78: "N", 79: "O", 80: "P", 81: "Q",
    82: "R", 83: "S", 84: "T", 85: "U",
    86: "V", 87: "W", 88: "X", 89: "Y",
    90: "Z", 97: "a", 98: "b", 99: "c",
    100: "d", 101: "e", 102: "f", 103: "g",
    104: "h", 105: "i", 106: "j", 107: "k",
    108: "l", 109: "m", 110: "n", 111: "o",
    112: "p", 113: "q", 114: "r", 115: "s",
    116: "t", 117: "u", 118: "v", 119: "w",
    120: "x", 121: "y", 122: "z"
  }

  function dataDistributionMethods(v, callBack) {
    console.log(v);
    var data = v.data;
    var dic = new Object();
    var body = new Object();
    switch (v.cmd) {
      case bluetoothApi.kGXYL_RealtimeIsOpen:
      console.log(data)
        if (data.length == 1) {
          var state = "";
          console.log(data,'设置成功吗')
          switch (data[0]) {
            case 0: state = "设置成功"; break;
            case 1: state = "设置失败"; break;
            case 2: state = "设置无效"; break;
            case 3: state = "占用"; break;
            case 4: state = "未发现"; break;
            case 5: state = "重复操作"; break;
            case 6: state = "充电保护"; break;
            case 7: state = "请充电!"; break;
            case 8: state = "无资源"; break;
            default: break;
          }
          body.setState = state;
        } else if (data.length == 5) {
          var realtimeData1 = new Object();
          realtimeData1.hrRealtime = data[4];
          realtimeData1.motionRealtime = data[0] | data[1] << 8 | data[2] << 16 | data[3] << 24;
          body.realtimeData = realtimeData1;
        }
        break;
      case bluetoothApi.kGXYL_TimeSync:
      case bluetoothApi.kGXYL_setPointer:
      case bluetoothApi.kGXYL_LaserRegimenParameters:
      case bluetoothApi.kGXYL_LaserManuallyParameters:
      case bluetoothApi.kGXYL_LaserManuallyPayParameters:
      case bluetoothApi.kGXYL_LaserIsOpen:
      case bluetoothApi.kGXYL_HRAutomaticallIsOpen:
      case bluetoothApi.kGXYL_HRManuallyIsOpen:
        var state = "";
        switch (data[0]) {
          case 0: state = "设置成功"; break;
          case 1: state = "设置失败"; break;
          case 2: state = "设置无效"; break;
          case 3: state = "占用"; break;
          case 4: state = "未发现"; break;
          case 5: state = "重复操作"; break;
          case 6: state = "正在充电"; break;
          case 7: state = "请充电!"; break;
          case 8: state = "无资源"; break;
          default: state = "设置失败"; break;
        }
        body.setState = state;
        break;
      case bluetoothApi.kGXYL_GetEQ: 
      console.log(data)                      // 获取电量
        body.eq = data[2];
        break;
      case bluetoothApi.kGXYL_GetLaserRecording: // 获取激光治疗记录数据
      console.log(data,'获取的激光数据')
        body.data = data;
        break;
      case bluetoothApi.kGXYL_GetHRRecording: // 获取心率检测记录数据
      console.log(data,'获得心率检测记录')
        body.data = data;
        break;
      case bluetoothApi.kGXYL_GetMotionRecording: // 获取运动数据
        body.data = data;
        break;
      case bluetoothApi.kGXYL_GetLaserManuallyParameters: // 获取激光手动参数
        body.duration = data[0] | data[1] << 8 | data[2] << 16 | data[3] << 24;
        body.power = data[4];
        body.time = data[5];
        break;
      case bluetoothApi.kGXYL_GetLaserRegimenParameters: // 获取激光疗程参数
        console.log(data);
        if (data.length == 1 && data[0] == 4) {
          body.isEmpty = true; // 表示没有设置参数
        } else {
          body.isEmpty = false; 
          body.sequence = data[0];// 序号
          body.pCount = data[1];// 参数列表个数
          body.periodic = data[2];// 开启周期
          body.gap = data[3];// 关闭间隙
          var year = data[4] | data[5] << 8;// 结束日期
          if (data[6] == 0 && data[7] == 0) {// 如果第6、7位为0的情况下表示天数
            body.remainingDays = year;
            body.treatmentDurationType = '0';
          } else {
            var month = data[6] + "";
            var day = data[7] + "";
            body.endDate = year + "-" + (month.length == 1 ? ("0" + month) : month) + "-" + (day.length == 1 ? ("0" + day) : day);
            body.treatmentDurationType = '1';
          }
          if (data.length > 8) { // 大于8， 表示有参数列表
            var paramentersTotalDuration = 0;
            var treatmentParaArray = new Array();
            var parametersCount = (data.length - 8) / 4;
            for (var index = 0; index < parametersCount; index++) {
              let treatment = new Object();
              treatment.power = data[8 + index * 4];
              treatment.duration = data[8 + index * 4 + 1];
              treatment.startHour = data[8 + index * 4 + 2];
              treatment.startMinute = data[8 + index * 4 + 3];
              treatmentParaArray.push(treatment);
              paramentersTotalDuration += parseInt(treatment.duration);
            }
            body.parameters = treatmentParaArray; // 参数列表
          }
        }
        break;
      case bluetoothApi.kGXYL_GetDeviceInfo:
        var asciiString = "";
        data.forEach((item) => {
          if (ASCIIDic[item]) {
            asciiString += ASCIIDic[item];
          }
        })
        var array = asciiString.split("&");
        array[2] = insert_flg(array[2], '.', 1);
        array[2] = insert_flg(array[2], '.', 3);
        body.deviceInfo = {
          "productModle": array[0],
          "manufacturerName": array[1],
          "firmwareVersion": array[2],
          "protocolStackVersion": array[3],
          "hardwareVersion": array[4],
          "factorySerialNumber": array[5]
        }
        break;

      case bluetoothApi.kGXYL_GetManuallyHRState:
        body.manuallyHRState = data[0];
        break;

      case bluetoothApi.kGXYL_GetAutoHRState:
        body.autoHRState = data[0];
        break;

      case bluetoothApi.kGXYL_GetManuallyLaserState:
        body.manuallyLaserState = data[0];
        break;
      default:
        break;
    }
    dic.cmd = v.cmd;
    dic.body = body;
    callBack(dic);
    receiveCacheArray = [];
  }
}

function insert_flg(str, flg, sn) {
  var newstr = "";
  for (var i = 0; i < str.length; i++) {
    var tmp = str.substr(i, 1);
    newstr += (i == sn) ? (tmp + flg) : tmp;
  }
  return newstr;
}

module.exports = {
  transceiver: transceiver
}

