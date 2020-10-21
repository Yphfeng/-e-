// pages/merchants/index/index.js
import getAjax from '../../../common/getAjax.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    listHeight: '',
    device_num: 0,
    sales_num: 0,
    store_id: '',
    getUserInfoFail: false,
    hasUserInfo: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var store_id = wx.getStorageSync('user').store_id;
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail: res => {
        console.log(4);
        this.setData({
          getUserInfoFail: true
        })
      }
    })

    this.setData({
      listHeight: wx.getSystemInfoSync().windowWidth / 2 - 20,
      store_id: store_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    this.login();
    var token = wx.getStorageSync('user').token;
    getAjax.getPost('/Weixin/Store/salesStockNum', { armariumScienceSession: token, store_id: _this.data.store_id })
      .then((res) => {
        _this.setData({
          device_num: res.data.list.device_num,
          sales_num: res.data.list.sales_num
        })
      })
      .catch((err) => {
        wx.showToast({
          title: err.data.msg
        })
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      this.openSetting();
    }

  },
  login: function () {
    var that = this
    wx.login({
      success: function (res) {
        var code = res.code;
        console.log(code);
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              getUserInfoFail: false,
              userInfo: res.userInfo,
              hasUserInfo: true

            })
            //平台登录
          },
          fail: function (res) {
            that.setData({
              getUserInfoFail: true
            })
          }
        })
      }
    })
  },
  //跳转设置页面授权
  openSetting: function () {
    var that = this
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {
          console.log(9);
          //尝试再次登录
          that.login()
        }
      })
    } else {
      console.log(10);
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
      })
    }
  },
  shipList() {
    wx.navigateTo({
      url: '/pages/merchants/shipList/shipList'
    })
  },
  returnGoods() {
    wx.navigateTo({
      url: '/pages/merchants/returnGoods/returnGoods'
    })
  },
  payment() {
    wx.navigateTo({
      url: '/pages/merchants/payment/payment'
    })
  },
  incomeorder(){
    wx.navigateTo({
      url: '/pages/merchants/incomorder/incomorder'
    })
  },
  unLogin() {
    wx.reLaunch({
      url: '../../home/home',
    })
  },
  // 退出函数 --已删除退出按钮
  unLoginIt() {
    var token = wx.getStorageSync("user").token;
    getAjax.getPost('/Weixin/Account/signOut', { token: token })
      .then((res) => {
        if (res.data.status == 1) {
          wx.removeStorage({
            key: 'user',
            success: function (response) {
              wx.reLaunch({
                url: "../../login/login"
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg
          })
        }
      })
      .catch((err) => {
        wx.showToast({
          title: err.data.msg
        })
      })
  }
})