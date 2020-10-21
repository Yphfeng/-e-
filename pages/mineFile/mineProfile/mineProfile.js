// mineMessage.js
var mineService = require('../../../common/newService/mineService.js');
const pushService = require('../../../common/newService/pushService.js');
import getAjax from '../../../common/getAjax.js';
const app = getApp();
var user = new Object();
var userCache = new Object();
userCache.name = "";
userCache.height = "";
userCache.weihgt = "";
userCache.sexIndex = "";
userCache.birth = "";
var disease_list;
var interest_list;
Page({

    /**
     * 页面的初始数据
     */
    data: {
      phone: '',
      isPhone: true,
      isSend: true,
      sendText: '获取验证码',
      code: '',
      showModal: false,
      notic:"", //这里是提示信息
      isdoltshow:false,
      isgetcode:false
    },
    onLoad: function() {
        const self = this;
        //判断是否绑定了手机号
        mineService.isBindPhone(function(res) {
            if (res.data.status == 2) {

                self.setData({
                    isBindPhone: true
                })
            } else {
                self.setData({
                    isBindPhone: false
                })
            }
        }, function(err) {

        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function(options) {

        var self = this;
        mineService.getUserInfo(function(res) {

            userCache.name = res.data.data[0].armarium_science_user_name;
            userCache.phone = res.data.data[0].armarium_science_user_mobile;
            userCache.height = res.data.data[0].armarium_science_user_sg;
            userCache.weihgt = res.data.data[0].armarium_science_user_tz;
            userCache.sexIndex = res.data.data[0].armarium_science_user_sex + '' == 'null' ? 1 : res.data.data[0].armarium_science_user_sex;
            userCache.birth = res.data.data[0].armarium_science_user_birthday + '' == 'null' ? "2017-01-01" : res.data.data[0].armarium_science_user_birthday;
            disease_list = JSON.stringify(res.data.disease_list);
            interest_list = JSON.stringify(res.data.interest_list);
            var interestText = "";
            var medicalText = "";
            if (res.data.disease_list) {
                res.data.disease_list.forEach((v, index) => {
                    if (index != res.data.disease_list.length - 1) {
                        medicalText += v.disease_name + "、"
                    } else {
                        medicalText += v.disease_name
                    }
                })
            }
            if (res.data.interest_list) {
                res.data.interest_list.forEach((v, index) => {
                    if (index != res.data.interest_list.length - 1) {
                        interestText += v.interest_name + "、"
                    } else {
                        interestText += v.interest_name
                    }
                })
            }
            if (res.data.status == 1) {

                self.setData({
                    userName: res.data.data[0].armarium_science_user_name,
                    userPhone: res.data.data[0].armarium_science_user_mobile,
                    userHeight: res.data.data[0].armarium_science_user_sg,
                    userWeight: res.data.data[0].armarium_science_user_tz,
                    date: userCache.birth,
                    sexs: ['女', '男'],
                    index: userCache.sexIndex,
                    medicalSubtext: medicalText.length == "0" ? "无" : medicalText,
                    interestSubtext: interestText.length == "0" ? "无" : interestText
                })
            }
        }, function(err) {})
    },

    bottomButton: function(e) {

        const typeName = e.currentTarget.dataset.bottombutton;
        switch (typeName) {
            case 'exit':
                wx.removeStorage({
                    key: 'user',
                    success: function(res) {
                        wx.reLaunch({
                            url: '../../login/login',
                        })
                    },
                })
                break;
            case "interest":
                wx.navigateTo({
                    url: 'interest?userSelecteds=' + interest_list,
                })
                break;
            case "medical":
                wx.navigateTo({
                    url: 'medical?userSelecteds=' + disease_list,
                })
                break;
            case "save":
                this.save();
                break;
            case "change":
                this.changeModel();
            default:
                break;
        }
    },

    bindPickerChange: function(e) {

        userCache.sexIndex = e.detail.value;
        this.setData({
            index: e.detail.value
        })
    },

    bindDateChange: function(e) {

        userCache.birth = e.detail.value;
        this.setData({
            date: e.detail.value
        })
    },

    inputAction: function(e) {

        var value = e.detail.value;
        switch (e.currentTarget.dataset.input) {
            case "userName":
                userCache.name = value;
                break;
            case "userHeight":
                userCache.height = value;
                break;
            case "userWeight":
                userCache.weihgt = value;
                break;
            default:
                break;
        }
    },

    save: function() {

        if (userCache.name != null) {
            user.name = userCache.name;
        }
        if (userCache.birth != null) {
            user.birth = userCache.birth;
        }
        if (userCache.sexIndex != null) {
            user.sex = userCache.sexIndex;
        }
        if (userCache.height != null) {
            user.height = userCache.height;
        }
        if (userCache.weihgt != null) {
            user.weight = userCache.weihgt;
        }
        // 保存到服务器
        mineService.updateUserInfo(user, function(res) {
            if (res.data.status == 1) {
                if (res.data.user_info_status == 1) {
                    wx.showModal({
                        title: '恭喜您获得100积分',
                        content: '请在积分界面中查看',
                        showCancel: false
                    })
                }
                wx.showToast({
                    title: '保存成功',
                })
            }
        }, function(err) {
            console.log(err);
        })
    },

    formSubmit: function(e) {

        const formId = e.detail.formId;
        console.log(formId.length);
        pushService.uploadFormId({
            form_id: formId,
            form_type: "2"
        }, function(res) {
            console.log(res);
        }, function(err) {});
    },
    changeModel() {
        if (this.data.isBindPhone) {
            this.setData({
                showModal: false
            })
            var user_type = wx.getStorageSync('user').user_type;
            if (user_type == 1) {
                wx.navigateTo({
                    url: '../../channelProvider/index/index'
                })
            } else if (user_type == 3) {
                wx.navigateTo({
                    url: '../../merchants/index/index'
                })
            } else {
                wx.showToast({
                    title: '您是用户身份，无法切换',
                    icon: 'none'
                })
            }
        } else {
            this.setData({
                showModal: true
            })
        }
    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function() {
        this.setData({
            showModal: false
        });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function() {
        this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function() {
        const self = this;
        const user = wx.getStorageSync("user");
        // 判断验证码是否正确
        if(!this.data.phone){
          self.setData({
            notic: '手机号不能为空',
            isdoltshow: true
          })
          return;
        }
        if (!this.data.code) {
          self.setData({
            notic: '验证码不能为空',
            isdoltshow: true
          })
          return;
        }
        wx.showLoading({
          title: '请稍后',
        })
        mineService.getRegVerify({ code: self.data.code, uid: self.data.uid }, function(res) {
          wx.hideLoading();
          console.log(res)
          if (res.data.status == 1) {
            mineService.bindPhone({
              wx_user_name: user.wx_user_name,
              head_portrait: user.wx_head_portrait,
              phone: self.data.phone }, function(res) {
                if (res.data.status == 1) {
                    if (res.data.bind_status !== 2) {
                        wx.showToast({
                            title: '绑定成功',
                        })
                        self.setData({
                            isSend: false,
                            isBindPhone: true,
                            showModal: false
                        })
                    }
                    if (res.data.bind_status == 2) {
                        getAjax.getPost("Weixin/UserBindPhone/saveUserinfo", {
                                wx_user_name: user.wx_user_name,
                                head_portrait: user.wx_head_portrait,
                                open_id: app.globalData.open_id,
                                armariumScienceSession: res.data.data.armarium_science_user_session
                            })
                            .then((response) => {
                                if (response.data.status == 1) {
                                    wx.showToast({
                                        title: '绑定成功',
                                    })
                                    user.token = res.data.data.armarium_science_user_session;
                                    wx.setStorageSync("user",user);
                                    self.setData({
                                        isSend: false,
                                        isBindPhone: true,
                                        showModal: false
                                    })
                                }
                            })
                            .catch((errst) => {

                            })

                    }
                    self.hideModal();
                } else {
                    wx.showToast({
                        title: '绑定失败'
                    })
                }
            }, function(err) {
                wx.showToast({
                    title: '绑定失败'
                })
            })
          } else {
            self.setData({
              notic:'验证码错误',
              isdoltshow: true
            })

          }
        })
    },
    //手机号输入框
    inputChange(e) {
        const testValue = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;
        const val = e.detail.value;
        this.setData({
            phone: val,
            notic:'',
            isdoltshow:false
            
        })
        if (testValue.test(val)) {
            this.setData({
                isPhone: false,
            })
        } else {
            this.setData({
                isPhone: true
            })
        }
    },
    //code输入框
    inputCodeChange(e) {
        const self = this;
        var vl = e.detail.value;
        self.setData({
            code: vl,
            notic: '',
            isdoltshow: false
        })
        // mineService.getRegVerify({ code: vl, uid: this.data.uid }, function(res) {
        //     console.log(res)
        //     if (res.data.status == 1) {
        //         self.setData({
        //             isSend: false
        //         })
        //     } else {
        //         self.setData({
        //             isSend: true
        //         })
        //     }
        // })
        if (vl){
          self.setData({
              isSend: false
          })
        }else{
          self.setData({
            isSend: true
          })
        }

    },
    //发送验证码
    send() {
        const self = this;
        var data = { phone: this.data.phone };
        console.log(data);
        // 判断手机号是否正确
      if (!this.data.isPhone){
        self.setData({
          isgetcode: true
        })
        wx.showLoading({
          title: '发送中',
        })
        mineService.sendRegVerify(data, function (res) {
          wx.hideLoading();
          if (res.data.status == 1) {
            wx.showToast({
              title: "验证码发送成功",
              icon: 'none'
            })
            self.setData({
              isgetcode: true,
              uid: res.data.uid
            })
            var currentTime = 60;
            const interval = setInterval(function () {
              self.setData({
                sendText: (currentTime - 1) + '秒'
              })
              currentTime--;
              if (currentTime <= 0) {
                clearInterval(interval)
                self.setData({
                  sendText: '重新获取',
                  currentTime: 60,
                  isgetcode: false
                })
              }
            }, 1000)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            self.setData({
              isgetcode: false
            })
          }
        }, function (err) {
          wx.hideLoading();
          wx.showToast({
            title: '发送失败',
            icon: 'none'
          })
          self.setData({
            isgetcode: false
          })
        })
      }else{
        this.setData({
          notic:'请输入正确的手机号码',
          isdoltshow:true
        })
      }
        
    }
})