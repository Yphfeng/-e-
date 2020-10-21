// setPassword.js
var password = "";
var surePassword = "";
var username = "";
var forgotPassword = 'false'
var md5 = require('../../common/md5.js');
var loginApi = require('../../common/newService/loginRegisterService');
const pushService = require('../../common/newService/pushService.js');
var scene = "";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    password_title: "",
    surePassword_title: "",
    isDisbledRegisterBTN: true,
    buttonTitle: '注册'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    username = options.username;
    scene = options.scene;

    forgotPassword = options.forgotPassword;
    if (forgotPassword == 'true') {
      this.setData({
        buttonTitle: '修改密码'
      })
    }
  },

  inputPasswordAction(e) {
    password = e.detail.value;
    if (password < 6) {
      this.setData({
        password_title: "密码长度必须是6位数以上"
      })
    } else {
      this.setData({
        password_title: "密码可用"
      })
    }
  },
  sureInputPasswordAction(e) {

    surePassword = e.detail.value;
    if (surePassword == password) {
      this.setData({
        surePassword_title: "密码可用",
        isDisbledRegisterBTN: false
      })
    } else {
      this.setData({
        surePassword_title: "密码不一致"
      })
    }
  },

  registerAction() {

    if (forgotPassword == 'true') {
      // 忘记密码
      loginApi.forgotPassword({
        password: password,
        userName: username
      }, function (res) {
        if (res.data.status == 1) {
          loginBJY(username, password);
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg ? res.data.msg : '网络出错',
          })
        }
      }, function (err) {
        wx.showToast({
          icon: 'none',
          title: '网络出错',
        })
      })
    } else if (scene + '' != "undefined") {// 二维码
      // 注册接口
      var userId = scene.split("_")[0].split(':')[1];
      var userType = scene.split("_")[1].split(':')[1];
      loginApi.register({ // 注册
        phoneNum: username,
        password: password,
        userId: userId,
        userType: userType
      }, function (res) {
        if (res.data.status == 1) {
          loginBJY(username, password); // 登录
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg ? res.data.msg : '网络出错',
          })
        }
      }, function (err) {
        wx.showToast({
          icon: 'none',
          title: '网络出错',
        })
      })
    } else {
      loginApi.register({ // 注册
        phoneNum: username,
        password: password
      }, function (res) {
        if (res.data.status == 1) {
          loginBJY(username, password);// 登录
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg ? res.data.msg : '网络出错',
          })
        }
      }, function (err) {
        wx.showToast({
          icon: 'none',
          title: '网络出错',
        })
      })
    }
  },

  formSubmit: function (e) {

    const formId = e.detail.formId;
    pushService.uploadFormId({
      form_id: formId,
      form_type: "2"
    }, function (res) {
      console.log(res);
    }, function (err) { });
  },
})

/**
 * 登录
 */
function loginBJY(username, password) {

  loginApi.login({
    phoneNum: username,
    password: password
  }, function (res) {
    if (res.data.status == 1) {
      wx.setStorage({
        key: 'user',
        data: res.data,
        success: function (res) { }
      });
      wx.reLaunch({
        url: '../home/home',
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '账号 / 密码不正确',
      })
    }
  }, function (res) {
    wx.showToast({
      icon: 'none',
      title: '网络出错',
    })
  })
}