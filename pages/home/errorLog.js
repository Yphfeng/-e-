
var otherService = require('../../common/newService/otherService.js');

var app = getApp();
var qbDate = require('../../common/qbDate.js');
var logArray;
function update(msgString, isUpdate) {

  logArray = app.getLocaltionLog();
  logArray.push(msgString);
  app.setLocaltionLog(logArray);
  
  if (isUpdate) {
    wx.getSystemInfo({
      success: function (res) {
        var deviceInfo = app.getDeviceInfo();
        var newDate = new Date();
        otherService.updateErrorLog({
          jsonData: JSON.stringify({
            deviceNumber: deviceInfo.deviceQRCode,
            phoneInfo: res,
            errMsg: logArray,
          }),
        }, function(res){
          
        }, function(err){
          app.removeLocaltionLog();
        })
      },
    })
  }
  
}

module.exports = {
  update: update
}