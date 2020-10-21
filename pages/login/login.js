// login.js
var username = "";
var password = "";
var isRightForUsername = false
var loginApi = require("../../common/newService/loginRegisterService");
const pushService = require('../../common/newService/pushService.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "",
        isDisabledLoginBTN: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    registerAction(e) {

        let action = e.currentTarget.dataset.loginotheraction

        if (action == "register") {
            wx.navigateTo({
                url: '../register/register',
            })
        } else if (action == "forgotPassword") {
            wx.navigateTo({
                url: '../register/forgotPassword',
            })
        }
    },

    loginAction: function () {

        var self = this;
        loginApi.login({
          phoneNum: username,
          password: password
        }, function (res) {

            if (res.data.status == 1) {
              console.log(res.data)
                wx.setStorage({
                    key: 'user',
                    data: res.data,
                    success: function (response) {
                      if(res.data.user_type == 2) {
                        wx.reLaunch({
                          url: '../home/home',
                        })
                      }else{
                        wx.redirectTo({
                          url: '../login/loginSuccess?user_type='+res.data.user_type,
                        })
                      }
                    }
                });
                
            } else {

                wx.showToast({
                  title: res.data.msg,
                })
            }
        }, function (res) {

            wx.showToast({
              title: '服务器繁忙',
            })
        })
    },

    inputUsernameblur(e) {

        username = e.detail.value;
        var title = "";
        if (username.length != 11) {
            title = "手机号码长度不正确";
            this.setData({
              isDisbledCheckBTN: true
            })
        } else {
            var myreg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|16[0-9])\d{8}$/;
            if (!myreg.test(username)) {
                title = "手机号码无效";
                this.setData({
                  isDisbledCheckBTN: true
                })
            } else {
                title = "手机号码可用";
                isRightForUsername = true
                this.setData({
                    isDisbledRegisterBTN: false
                })
            }
        }
        this.setData({
          title: title
        })
    },

    inputPasswordblur(e) {

        password = e.detail.value;
        if (password.length >= 6 && isRightForUsername == true) {
            this.setData({
                isDisabledLoginBTN: false
            })
        }
    },

      formSubmit: function (e) {

      const formId = e.detail.formId;
      pushService.uploadFormId({
        form_id: formId,
        form_type: "2"
      }, function (res) {
      }, function (err) { });
    },
})