// pages/merchants/index/index.js
import getAjax from '../../../common/getAjax.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listHeight: '',
    store_num: 0,
    store_device_num: 0,
    getUserInfoFail: false,
    hasUserInfo: false

  },

    /**
     *    * 生命周期函数--监听页面加载
     */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.setData({
      listHeight: wx.getSystemInfoSync().windowWidth / 2 - 20
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
    const _this = this;
    this.login();
    var token = wx.getStorageSync('user').token;
    getAjax.getPost('/Weixin/DealerStore/storeDeliverDeviceNum', { armariumScienceSession: token })
      .then((res) => {
        _this.setData({
          store_num: res.data.list.store_num,
          store_device_num: res.data.list.store_device_num
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
  addList() {
    wx.navigateTo({
      url: '/pages/channelProvider/add/add'
    })
  },
  showList() {
    wx.navigateTo({
      url: '/pages/channelProvider/list/list'
    })
  },
  checkList(){
    wx.navigateTo({
      url: '/pages/channelProvider/check/check'
    })
  },
  returnGoods(){
    wx.navigateTo({
      url: '/pages/channelProvider/returndevice/returndevice'
    })
  },
  management(){
    wx.navigateTo({
      url: '/pages/channelProvider/management/management'
    })
  },
  userReturnGoods(){
  wx.navigateTo({
    url: '/pages/channelProvider/userReturnGoods/userReturnGoods'
  })
  },
  equipmentManage(){
    wx.navigateTo({
      url: '/pages/channelProvider/equipmentManage/equipmentManage',
    })
  },
  unLogin(){
      wx.reLaunch({
        url: '../../home/home',
      })
  },
  //退出函数--已去掉按钮
  unLoginIt(){
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