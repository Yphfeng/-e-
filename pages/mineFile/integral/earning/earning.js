// pages/mineFile/integral/earning/earning.js
import getAjax from '../../../../common/getAjax.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remoney:""
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
    this.getdata(token, _this);
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
    this.getdata(this.data.token,this);
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
  gowithDraw(){
    wx.navigateTo({
      url: "/pages/mineFile/integral/withDraw/withDraw?remoney="+this.data.remoney,
    })
  },
  getdata(token, _this) {
    getAjax.getPost("/Weixin/HealthAmbassador/incomeBalance", { armariumScienceSession: token }).then((res) => {
      _this.setData({
        remoney:res.data.money
      })
    }).catch((err) => {
      // wx.showToast({
      //   title: err.data.msg,
      //   icon: 'success',
      //   duration: 1000
      // });
    })
  }
})