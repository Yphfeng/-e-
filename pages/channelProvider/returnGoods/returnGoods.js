// pages/merchants/send/send.js
import getAjax from '../../../common/getAjax.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    _height: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    wx.getSystemInfo({
      success: function(res){
        _this.setData({
          _height: res.windowHeight
        })
      }
    })
    // var token = wx.getStorageSync("user").token;
    // getAjax.getPost("/Weixin/DealerStore/deviceBackList", { armariumScienceSession: token})
    // .then((res) => {
    //   console.log(res)
    // })
    // .catch((err) => {
    //   console.log(err)
    // })
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
  returnGoods(){
    var token = wx.getStorageSync("user").token;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: 'qrCode',
      success: function (res) {
        getAjax.getPost("/Weixin/DealerStore/deviceBack", { device_sn: res.result, armariumScienceSession: token})
        .then((response) => {
            if(response.data.status == 1) {
              wx.showToast({
                title: response.data.msg
              })
            }else{
              wx.showToast({
                title: response.data.msg
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
  }
})