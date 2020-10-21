var username = "";
var password = "";
var surePassword = "";
var isRightUsername = false
var loginService = require('../../common/newService/loginRegisterService.js');
var total = 30;
var time = new Object();
var checkNumber = ""
var uid = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    title: "",
    chectBTNTitle: "点击获取",
    isDisbledCheckBTN: true,
    isDisbledRegisterBTN: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          containerViewHeight: res.screenHeight - 64
        })
      },
    })
  },
  registerAction() {

    loginService.checkForgotPasswordCheckNumber({
      phone: username,
      uid: uid,
      code: checkNumber
    }, function (res) {
      if (res.data.status == 1) {

        wx.navigateTo({
          url: 'setPassword?username=' + username + '&forgotPassword=true',
        })
      } else {
        wx.showToast({ title: '验证码错误', });
      }
    }, function (err) {
      console.log(err);
    })
  },

  inputUsernameblur(e) {

    username = e.detail.value;
    var title = ""
    if (username.length != 11) {
      title = "手机号码长度不正确";
      this.setData({
        isDisbledCheckBTN: true
      })
    } else {
      var myreg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
      if (!myreg.test(username)) {
        title = "手机号码无效";
        this.setData({
          isDisbledCheckBTN: true
        })
      } else {
        title = "手机号码可用";
        this.setData({
          isDisbledCheckBTN: false
        })
        isRightUsername = true;
      }
    }
    this.setData({
      title: title
    })
  },

  inputCheckNumberAction(e) {

    checkNumber = e.detail.value;
    if (checkNumber != "" || checkNumber != undefined) {
      this.setData({
        isDisbledRegisterBTN: false
      })
    }
  },

  getCheckNumber() {

    run(this)
  }
})
function run(that) {

  loginService.getForgotPasswordCheckNumber(username, (res) => {

    if (res.data.status == 1) {
      // 提示获取验证码成功
      wx.showToast({ title: '验证码已发送', })
      // 保存uid
      uid = res.data.uid;
      // 设置按钮
      that.setData({
        isDisbledCheckBTN: true,
        chectBTNTitle: total + "s后重新获取"
      })
      time = setInterval(function run1() { 
        return setCheckBTNTitle(self);
      }, 1000);
    } else {
      wx.showToast({ title: res.data.msg, });
    }
  }, (err) => {
    console.log(err);
  })
}
function setCheckBTNTitle(that) {
  total--;
  that.setData({
    chectBTNTitle: total + "s后重新获取"
  })
  if (total == 0) {
    total = 30;
    clearInterval(time);
    that.setData({
      isDisbledCheckBTN: false,
      chectBTNTitle: "重新获取"
    })
  }
}