// pages/merchants/send/send.js
import getAjax from '../../../common/getAjax.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    _height: '',
    sinfo:'',
    token:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          _height: res.windowHeight
        })
      }
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
  // 点击确认
  returnGoods() {
    if (this.data.device_sn==""){
      wx.showToast({
        title: "请扫描设备",
        duration: 2000
      })
    }
    var token = wx.getStorageSync("user").token;
    console.log(wx.getStorageSync("user"));
    var store_id = wx.getStorageSync("user").store_id;
    getAjax.getPost("/Weixin/Store/backDevive", { store_id: store_id, device_sn: this.data.device_sn, armariumScienceSession: this.data.token })
      .then((response) => {
        if (response.data.status == 1) {
          wx.showToast({
            title: response.data.msg,
            duration: 2000
          })
          this.setData({
            device_sn:"",
            sinfo: ""
          })
        } else {
          wx.showToast({
            title: response.data.msg,
            duration: 2000
          })
        }
      })
      .catch((err) => {
        wx.showToast({
          title: err.data.msg,
          duration: 2000
        })
      })
  },
  // 扫描设备
  scancode(){
    var _this = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: 'qrCode',
      success:function(res){
        
        var token = wx.getStorageSync("user").token;
        console.log(wx.getStorageSync("user"));
        var store_id = wx.getStorageSync("user").store_id;
        _this.setData({
          device_sn: res.result,
          token: token
        })
        getAjax.getPost("/Weixin/Store/getBackDeviveInfo", { store_id: store_id, device_sn: _this.data.device_sn, armariumScienceSession: _this.data.token })
          .then((response) => {
            console.log(response);
            if (response.data.status == 1) {
              wx.showToast({
                title: response.data.msg,
                duration: 2000
              })
              var sinfo = response.data.list[0];
              sinfo.sale_time = _this.timestampToTime(sinfo.sale_time);
              var ndata = new Date();
              var dat = ndata.getTime()/1000;
              sinfo.nowdata = _this.timestampToTime(dat);
              if (sinfo.sale_status ==0){
                sinfo.sale_status ="未销售"
              } else if (sinfo.sale_status == 1) {
                sinfo.sale_status = "试用期"
              } else if(sinfo.sale_status == 2) {
                sinfo.sale_status = "已销售"
              }else{
                sinfo.sale_status = "-"
              }
              _this.setData({
                sinfo: sinfo
              })
            } else {
              wx.showToast({
                title: response.data.msg,
                duration: 2000
              })
            }
          })
          .catch((err) => {
            console.log(err);
            wx.showToast({
              title: err.data.msg
            })
          })
        
      }
    })
  },
  timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
  }
})