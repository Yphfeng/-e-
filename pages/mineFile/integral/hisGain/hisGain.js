// pages/mineFile/integral/hisGain/hisGain.js
import getAjax from '../../../../common/getAjax.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    datalist: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync("user").token;
    this.setData({
      token: token
    })
    var _this = this;
    this.getdata(this.data.token, _this);
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
  getdata(token, _this) {
    getAjax.getPost("/Weixin/HealthAmbassador/historicalIncome", { armariumScienceSession: token }).then((res) => {
     _this.setData({
       datalist:res.data.data
     })
    }).catch((err) => {
      // wx.showToast({
      //   title: err.data.msg,
      //   icon: 'success',
      //   duration: 1000
      // });
    })
  },
})