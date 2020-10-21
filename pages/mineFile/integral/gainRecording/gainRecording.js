// pages/mineFile/integral/gainRecording/gainRecording.js
import getAjax from '../../../../common/getAjax.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: '0',
    nowdata: '',
    token: "",
    datalist: "",
    datasum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nowdata = new Date();
    var nowd = nowdata.getTime() / 1000;
    this.setData({
      nowdata: this.timestampToTime(nowd, 0)
    })
    var token = wx.getStorageSync("user").token;
    this.setData({
      token: token
    })
    var _this = this;
    this.getnowdata(this.data.token, _this);
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
  //改变类型
  changetypes(e) {
    this.setData({
      types: e.currentTarget.dataset.typeindex
    })
    var _this = this;
    if (this.data.types == 0) {
      this.getnowdata(this.data.token, _this);
    } else if (this.data.types == 1) {
      this.getdata(this.data.token, _this)
    }

  },
  // 时间戳变换
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
  hisGain(){
    wx.navigateTo({
      url: "/pages/mineFile/integral/hisGain/hisGain",
    })
  },
  getnowdata(token, _this) {
    getAjax.getPost("/Weixin/HealthAmbassador/todayIncome", { armariumScienceSession: token }).then((res) => {
      var info = res.data.data;
      for (var i = 0; i < res.data.data.length;i++){
        info[i].add_time = _this.timestampToTime(info[i].add_time, 1)
      }
      _this.setData({
        datalist: info,
        datasum: res.data.money
      })
    }).catch((err) => {
      _this.setData({
        datalist: "",
        datasum:0.00
      })
      // wx.showToast({
      //   title: err.data.msg,
      //   icon: 'success',
      //   duration: 1000
      // });
    })
  },
  getdata(token, _this) {
    getAjax.getPost("/Weixin/HealthAmbassador/healthAmbassadorEarnings", { armariumScienceSession: token }).then((res) => {
      var info = res.data.data;
      for (var i = 0; i < res.data.data.length; i++) {
        info[i].add_time = _this.timestampToTime(info[i].add_time, 1)
      }
      _this.setData({
        datalist: info,
        datasum: res.data.money
      })
    }).catch((err) => {
      _this.setData({
        datalist:"",
        datasum: 0.00
      })
      // wx.showToast({
      //   title: err.data.msg,
      //   icon: 'success',
      //   duration: 1000
      // });
    })
  },
})