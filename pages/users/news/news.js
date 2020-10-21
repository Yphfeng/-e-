// pages/news/news.js
import getAjax from "../../../common/getAjax.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    password: '',
    array:["用户","渠道商","商户"],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  bindPasswordInput: function(e) {
    var _this = this;
    var value = e.detail.value;
    _this.setData({
      password: value
    })
  },
  bindPhoneInput: function(e) {
    var _this = this;
    var value = e.detail.value;
    _this.setData({
      mobile: value
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  nextStep: function(){
    var _this = this;
    var myreg = /^1[34578]\d{9}$/;
    if (!myreg.test(_this.data.mobile)) {
      if (!_this.data.mobile){
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none',
          duration: 2000
        })
      }else{
        wx.showToast({
          title: '手机号不正确',
          icon: 'none',
          duration: 2000
        })
      }

    }else{
      if(!_this.data.password){
        wx.showToast({
          title: '密码为空',
          icon: 'none',
          duration: 2000
        })
      }else{
        getAjax.getPost("/Weixin/Account/storeUserLogin", { mobile: _this.data.mobile, password: _this.data.password})
        .then((res) => {
          if(res.data.status == 1) {
            wx.setStorageSync('token', res.data.token);
            wx.setStorageSync('store_id', res.data.store_id);
            if(res.data.user_type == 1) {
              wx.reLaunch({
                url: '/pages/channelProvider/index/index',
              })
            }else{
              wx.reLaunch({
                url: '/pages/merchants/index/index'
              })
            }
            
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: "none",
            })
          }
          
        })
        .catch((err) => {
          wx.showToast({
            title: err.data.msg,
            icon: "none"
          })
          
        })
        
      }
    }
  }
})