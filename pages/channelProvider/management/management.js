// pages/merchants/check/check.js
import getAjax from '../../../common/getAjax.js';

const app = getApp();
var page = 1;
var GetList = function (that) {
  getAjax.getPost("/Weixin/DealerStore/auditStoreList", { page: page, armariumScienceSession: that.data.token })
    .then((res) => {
      var listData = that.data.listData;
      if (res.data.status == 1) {
        for (var i = 0; i < res.data.list.store_user_data.length; i++) {
          listData.push(res.data.list.store_user_data[i]);
        }
        that.setData({
          listData: listData,
        });
      }
    })
    .catch((err) => {

    })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    scrollTop: '',
    listData: [],
    params: {},
    token: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var token = wx.getStorageSync("user").token;
    this.setData({
      token: token
    })
    wx.getSystemInfo({
      success: (res) => {
        _this.setData({
          height: res.windowHeight
        })
      }
    });
    getAjax.getPost("/Weixin/DealerStore/auditStoreList", { page: 1, armariumScienceSession: _this.data.token }).then((res) => {
      _this.setData({
        listData: res.data.list.store_user_data
      })
    }).catch((err) => {
      wx.showToast({
        title: err.data.msg,
        icon: 'success',
        duration: 1500
      });
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
  edit: function (e) {
    var id = e.target.dataset.uid;
    wx.navigateTo({
      url: '/pages/channelProvider/edit/edit?id=' + id
    })
  }

})