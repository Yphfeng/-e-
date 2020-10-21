//index.js
import getAjax from "../../../common/getAjax.js"
import url from '../../../common/url.js'
//获取应用实例
const app = getApp();
var isEmptyObject = function (e) {
  var temp;
  for (temp in e)
    return !1;
  return !0
}

Page({
  data: {
    mobile:'',
    showModalStatus: false,
    baseUrl: '',
    manage: '<租赁协议>',
    protocol: '',
    store_name: '',
    stock_num: '',
    dialogWidth: '',
    showModal: false,
    items: [{ name: '1', value: '1' }],
    bannerHeight: '',
    swiperHeight: '',
    imgUrls: [],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    array: ['Android', 'IOS', 'ReactNativ', 'WeChat', 'Web'],
    index: 0,
    number: 0,
    minusStatus: 'disabled',
    wholesaler_id: '',
    store_id: '',
    wx_open_id: '',
    params: {
      code: '',
      wx_name: '',
      wx_open_id: '',
      wholesaler_id: '',
      device_code: '',
      device_num: {
        type: Number,
        default: 1
      }
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../../logs/logs'
    })
  },
  onLoad: function (options) {
    var self = this;
    var info = wx.getSystemInfoSync();
    this.setData({
      dialogWidth: info.windowWidth - 40,
      _height: info.windowHeight - 280,
      baseUrl: app.urlWWW
    })
    let q = decodeURIComponent(options.scene);
    console.log(q);
    if (q) {
      var wholesaler_id = q.split('&')[0].split('=')[1];
      var store_id = q.split('&')[1].split('=')[1];
      this.setData({
        wholesaler_id: wholesaler_id,
        store_id: store_id
      })
    } else {
      return;
    }
    var resInfo = wx.getSystemInfoSync();
    this.setData({
      bannerHeight: resInfo.windowHeight - 200,
      swiperHeight: resInfo.windowWidth - 110,
      store_id: store_id,
      wholesaler_id: wholesaler_id
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
          that.checkSettingStatu();
        },
        fail: function () {
          wx.showModal({
            title: '用户未授权',
            content: '如需正常使用该小程序功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
            showCancel: false,
            success: function (resbtn) {
              if (resbtn.confirm) {
                wx.openSetting({
                  success: function success(resopen) {
                    //  获取用户数据
                    that.checkSettingStatu();
                  }
                });
              }
            }
          })
        }
      })
    }
    wx.login({
      success: res => {
        console.log(res)
        if (res.code) {
          getAjax.getPost('Weixin/Store/getUserOpen_id', { code: res.code })
            .then((res) => {
              this.setData({
                wx_open_id: res.data.open_id
              })
            })
            .catch((err) => {

            })
          }
        }
    })
    getAjax.getPost("Weixin/Store/getStoreShopPaydata", { store_id: self.data.store_id })
      .then((res) => {

        if (res.data.status == 1 && res.data.img_url) {
          var imgUrl = JSON.parse(res.data.img_url);
          this.setData({
            imgUrls: imgUrl,
            stock_num: res.data.stock_num,
            store_name: res.data.store_name,
            protocol: res.data.protocol
          })
        } else {
          this.setData({
            imgUrls: []
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },
  checkSettingStatu: function (cb) {
    var that = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        var authSetting = res.authSetting;
        if (isEmptyObject(authSetting)) {
          //第一次
        } else {
          // 没有授权的提醒
          if (authSetting['scope.userInfo'] === false) {
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用该小程序功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: function success(res) {
                      console.log()
                    }
                  });
                }
              }
            })
          } else if (authSetting['scope.userInfo'] === true) {
            //该处用户获取用户的一些授权信息
            if (that.data.userInfo) {
              var nickname = that.data.userInfo.nickName;
              var gender = that.data.userInfo.gender
              //性别 0：未知、1：男、2：女
              if (gender == 1) {
                gender = "True"
              } else if (gender == 2) {
                gender = "False"
              } else {
                gender = "True"
              }

            }
          }
        }
      }
    })
  },
  listenerPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index: e.detail.value
    });
  },
  de() {
    var _this = this;
    if (this.data.number < 1) {
      return
    } else {
      var n = this.data.number;
      n--;
      var minusStatus = n <= 1 ? 'disabled' : 'de';

      this.setData({
        number: n,
        minusStatus: minusStatus
      })
    }
  },
  ad() {
    var _this = this;
    var n = _this.data.number;
    var minusStatus = n < 1 ? 'disabled' : 'de';
    n++;
    if (n > _this.data.stock_num) {
      n = _this.data.stock_num
    }
    _this.setData({
      number: n,
      minusStatus: minusStatus
    })

  },
  inputChanged(e) {
    console.log(e);
    var n = e.detail.value;
    if (n < 0) {
      var minusStatus = n < 2 ? 'disabled' : 'de';
      this.setData({
        number: 0,
        minusStatus: minusStatus
      })
    } else if (n > this.data.stock_num) {
      n = this.data.stock_num
      var minusStatus = n < 2 ? 'disabled' : 'de';
      this.setData({
        number: n,
        minusStatus: minusStatus
      })
    }
  },
  pay() {
    //点击支付
    const _this = this;
    if (Number(_this.data.number) > Number(_this.data.stock_num)) {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      })
    } else if (_this.data.number == 0) {
      wx.showToast({
        title: '请选择数量',
        icon: 'none'
      })
    } else {
      wx.login({
        success: res => {
          console.log(res)
          if (res.code) {
            _this.setData({
              code: res.code
            })
            wx.request({
              url: app.urlWWW+ 'Weixin/Store/createrOrder',
              method: 'POST',
              dataType: 'json',
              header: { "Content-Type": "application/x-www-form-urlencoded" },
              data: {
                code: _this.data.code,
                wx_name: _this.data.userInfo.nickName,
                wx_open_id: _this.data.wx_open_id,
                wholesaler_id: _this.data.wholesaler_id,
                device_num: _this.data.number,
                store_id: _this.data.store_id,
                mobile: _this.data.mobile
              },
              success: function (res) {
                if (res.data.status == 1) {
                  var payParams = JSON.parse(res.data.jsApiParameters);
                  wx.requestPayment({
                    'timeStamp': payParams.timeStamp,
                    'nonceStr': payParams.nonceStr,
                    'package': payParams.package,
                    'signType': payParams.signType,
                    'paySign': payParams.paySign,
                    success: function (response) {
                      console.log(response)
                      if (response.errMsg == "requestPayment:ok") {
                        wx.redirectTo({
                          url: '../../home/home',
                        })
                      }else{
                        //用户取消支付
                      }
                    },
                    fail: function (response) {

                    }
                  })
                }
              }
            })
          }
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
      })
    }
  },
  util: function (currentStatu) {
    var _this = this;
    var mobileTest = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
     /* 动画部分 */
     // 第1步：创建动画实例 
     var animation = wx.createAnimation({
       duration: 200, //动画时长 
       timingFunction: "linear", //线性 
       delay: 0 //0则不延迟 
     });

     // 第2步：这个动画实例赋给当前的动画实例 
     this.animation = animation;

     // 第3步：执行第一组动画 
     animation.opacity(0).rotateX(-100).step();

     // 第4步：导出动画对象赋给数据对象储存 
     this.setData({
       animationData: animation.export()
     })

     // 第5步：设置定时器到指定时候后，执行第二组动画 
     setTimeout(function () {
       // 执行第二组动画 
       animation.opacity(1).rotateX(0).step();
       // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
       this.setData({
         animationData: animation
       })

       //关闭 
       if (currentStatu == "close") {
         console.log(_this.data.mobile)
         if (mobileTest.test(_this.data.mobile)){
           _this.setData(
            {
              showModalStatus: false
            }
          );
           _this.pay();
        }else{
          wx.showToast({
            title: '请输入正确手机号',
            icon: 'none'
          })
        }

       }
     }.bind(this), 200)

     // 显示 
     if (currentStatu == "open") {
       this.setData(
         {
            showModalStatus: true
         }
       );
     }
   },
  bindMobileInput(e){
    var vl = e.detail.value;
    this.setData({
      mobile: vl
    })
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  closeModel: function(){
    this.setData(
      {
        showModalStatus: false
      }
    );
  },
  bindGetUserInfo: function (e) {
    console.log(e);
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo
      })
      this.powerDrawer(e);
    }
  },
  checkboxChange: function (e) {
    const self = this;
    console.log(e);
    if (e.detail.value.length > 0) {
      self.setData({
        items: [{ name: '1', value: '1', checked: 'true' }]
      })
    } else {
      self.setData({
        items: [{ name: '1', value: '1' }]
      })
    }
  },
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  hideModal: function () {
    this.setData({
      showModal: false
    })
  },
  onCancel: function () {
    this.setData({
      showModal: false
    })
  },
  onConfirm: function () {
    this.setData({
      showModal: false,
      items: [{ name: 1, value: 1, checked: 'true' }]
    })
  }
})
