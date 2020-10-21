// pages/merchants/check/check.js
import getAjax from '../../../common/getAjax.js';

const app = getApp();
var page = 1;
var GetList = function (that) {
  getAjax.getPost("/Weixin/Store/getOrderList", { page: page, armariumScienceSession: that.data.token, store_id: that.data.store_id })
    .then((res) => {
      var listData = that.data.listData;
      if (res.data.order_status == 1) {
        for (var i = 0; i < res.data.list.store_order_info.length; i++) {
          listData.push(res.data.order_list[i]);
        }
        that.setData({
          listData: listData,
        });
      }
    })
    .catch((err) => {

    })
}
function add0(m) { return m < 10 ? '0' + m : m }
function format(shijianchuo) {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(Number(shijianchuo)*1000);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  // return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
  return y + '-' + add0(m) + '-' + add0(d);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    scrollTop: '',
    listData: "",
    params: {},
    token: '',
    store_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var token = wx.getStorageSync("user").token;
    var store_id = wx.getStorageSync("user").store_id;
    this.setData({
      token: token,
      store_id: store_id
    })
    wx.getSystemInfo({
      success: (res) => {
        _this.setData({
          height: res.windowHeight
        })
      }
    });

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
    getAjax.getPost("/Weixin/Store/getOrderList", { page: 1, armariumScienceSession: _this.data.token, store_id: _this.data.store_id }).then((res) => {
      if (res.data.order_status == 1) {
        var listData = res.data.order_list;
        listData.forEach(function(v){
          var t = format(v.add_time); 
          v.add_time = t;
        })
        _this.setData({
          listData: listData
        })
      }
      if (res.data.order_status == 0){
        _this.setData({
          listData: ""
        })
      }
    }).catch((err) => {
      // wx.showToast({
      //   title: err.data.msg,
      //   icon: 'none',
      //   duration: 1500
      // });
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
    var that = this;
    page++;
    GetList(that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  refresh: function (event) {
    if (this.data.scrollTop < -100) {
      page = 1;
      this.setData({
        listData: [],
        scrollTop: 0
      });
      GetList(this)
    }
  },
  lower() {
    var that = this;
    page++;
    GetList(that);
  },
  send: function (e) {
    var _this = this;
    var id = e.target.dataset.uid;
    wx.navigateTo({
      url: '/pages/merchants/send/send?store_id=' + _this.data.store_id + '&order_id=' + id
    })
  },


})