var qbService = require('service');

function getProductImageUrl(complete, fail) {

  qbService.request({
    path: 'Weixin/Index/getProductIntroduction',
    data: {},
    method: 'POST'
  }, complete, fail)
}

function getUserQRCodeWithUserId(userId, complete, fail) {

  wx.request({
    url: 'Weixin/Share/shareUserQrcode',
    data: {
      user_id: userId,
      login_type: '2'
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: "POST",
    success: complete,
    fail: fail
  })
}

function getEbiRuleImage(complete, fail) {

  qbService.request({
    path: 'Weixin/Index/getEbRule',
    data: {},
    method: 'POST'
  }, complete, fail)
}

function getPointerRuleImage(complete, fail) {

  qbService.request({
    path: 'Weixin/Index/getPointRule',
    data: {},
    method: 'POST'
  }, complete, fail)
}

function updateErrorLog(dic, complete, fail) {

  qbService.request({
    path: 'Weixin/User/uploadUserFailPhoneInfo',
    data: {
      data: dic.jsonData
    },
    method: 'POST'
  },complete, fail)
}

function getUserShareData(userId, complete, fail) {

  qbService.request({
    path: 'Weixin/Share/getUserShareData',
    data: {
      user_id: userId,
    },
    method: 'POST'
  }, complete, fail);
}

function getDeviceVideo(complete, fail) {
  qbService.request({
    path: 'Weixin/Index/getVideoUrl',
    data: {},
    method: 'POST'
  }, complete, fail);
}
module.exports = {
  getPointerRuleImage: getPointerRuleImage,
  getEbiRuleImage: getEbiRuleImage,
  getProductImageUrl: getProductImageUrl,
  getUserQRCodeWithUserId: getUserQRCodeWithUserId,
  updateErrorLog: updateErrorLog,
  getUserShareData: getUserShareData,
  getDeviceVideo: getDeviceVideo
}