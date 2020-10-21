// pages/mineFile/integral/recordDraw/recordDraw.js
import getAjax from '../../../../common/getAjax.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    datalist:''
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
  timestampToTime(timestamp, typ) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes();
    if (typ == 0) {
      return Y + M + D
    } else {
      return Y + M + D + h + m;
    }
  },
  getdata(token, _this) {
    getAjax.getPost("/Weixin/HealthAmbassador/withdrawalsRecord", { armariumScienceSession: token }).then((res) => {
      var dainfo = res.data.record;
      for (var i = 0; i < dainfo.length; i++) {
        dainfo[i].apply_time = _this.timestampToTime(parseInt(dainfo[i].apply_time), 0)
      }
      _this.setData({
        datalist: dainfo,
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