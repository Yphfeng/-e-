
var qbService = require('service');
var app = getApp();

function login(dic, completed, fail) {
  wx.login({
    success: function(res) {
      qbRequest({
        path: 'Weixin/Account/login',
        data: {
          mobile: dic.phoneNum,
          password: dic.password,
          login_type: app.loginType,
          code: res.code
    },
        method: "POST"
      }, function (res) {
        completed(res);
      }, function (err) {
        fail(err);
      })
    },
    fail: function(res) {},
    complete: function(res) {},
  })
}

function register(dic, completed, fail) {

  var data = {
    mobile: dic.phoneNum,
    password: dic.password
  }
  if (dic.userType != undefined) {
    data.user_type = dic.userType;
  }
  if (dic.userId != undefined) {
    data.user_id = dic.userId;
  }

  qbRequest({
    path: 'Weixin/Account/reg',
    data: data,
    method: "POST"
  }, function (res) {
    completed(res);
  }, function (err) {
    fail(err);
  })
}

function qbRequest(dic, completed, fail) {

  wx.request({
    url: app.urlPrefix + dic.path,
    method: dic.method,
    data: dic.data,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      completed(res);
    },
    fail: function (res) {
      error(res);

    }
  });
}

function forgotPassword(dic, complete, fail) {

  qbRequest({
    path: 'Weixin/Account/recoveredPassword',
    data: {
      mobile: dic.userName,
      password: dic.password
    },
    method: 'POST'
  }, complete, fail)
}

function getRegisterCheckNumber(phone, complete, fail) {

  qbRequest({
    path: 'Weixin/Account/sendRegVerify',
    data: {
      phone: phone
    },
    method: 'POST'
  }, complete, fail)
}

function checkRegisterCheckNumber(dic, complete, fail) {

  qbRequest({
    path:'Weixin/Account/getRegVerify',
    data: {
      phone: dic.phone,
      uid: dic.uid,
      code: dic.code
    },
    method: 'POST'
  }, complete, fail)
}

function getForgotPasswordCheckNumber(phone, complete, fail) {

  qbRequest({
    path: 'Weixin/Account/sendRetrieveVerify',
    data: {
      phone: phone
    },
    method: 'POST'
  }, complete, fail)
}

function checkForgotPasswordCheckNumber(dic, complete, fail) {

  qbRequest({
    path: 'Weixin/Account/getRetrieveVerify',
    data: {
      phone: dic.phone,
      uid: dic.uid,
      code: dic.code
    },
    method: 'POST'
  }, complete, fail);
}

module.exports = {
  login: login,
  register: register,
  forgotPassword: forgotPassword,
  getRegisterCheckNumber: getRegisterCheckNumber,
  checkRegisterCheckNumber: checkRegisterCheckNumber,
  getForgotPasswordCheckNumber: getForgotPasswordCheckNumber,
  checkForgotPasswordCheckNumber: checkForgotPasswordCheckNumber
}