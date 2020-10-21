// pages/merchants/send/send.js
import getAjax from '../../../common/getAjax.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    device_num: 0,
    sales_num: 0,
    store_id: '',
    uid: '',

    main: {},
    device_code: '',
    status: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync("user").token || '';
    var store_id = wx.getStorageSync("user").store_id || '';
    var uid = options.order_id;
    this.setData({
      token: token,
      store_id: store_id,
      uid: uid
    })
    getAjax.getPost("/Weixin/Store/placeOrderNum", { armariumScienceSession: token, store_id: store_id, order_id: this.data.uid  })
      .then((res) => {
        if (res.data.status == 1) {
          this.setData({
            device_num: res.data.list.device_num
          })
        } else {
          wx.showToast({
            title: '获取数量错误'
          })
        }
      })
      .catch((err) => {
        wx.showToast({
          title: '获取数量错误'
        })
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
  formSubmit: function () {
    var _this = this;
    wx.scanCode({
      onlyFromCamera: false,
      success: function (res) {
        var device_sn = res.result;
        var str = device_sn.slice(1, 2);
        console.log(str);
        switch (str) {
          case 'A':
            var device_code = "HA01AS";
            break;
          case 'B':
            var device_code = "HA01CW";
            break;
          case 'C':
            var device_code = "HA05AW";
            break;
          case 'D':
            var device_code = "HA06AW";
            break;
          case 'E':
            var device_code = "HA01A";
            break;
          case 'Z':
            var device_code = "HA051W";
            break;
          default:
            var device_code = "";
            break;
        }
        _this.setData({
          device_code: device_code,
          device_sn: device_sn
        })
        getAjax.getPost('/Weixin/Store/deliver', { armariumScienceSession: _this.data.token, store_id: _this.data.store_id, order_id: _this.data.uid, device_sn: device_sn })
      .then((res) => {
        var alreadyCount = Number(_this.data.sales_num) + 1;
        _this.setData({
          sales_num: alreadyCount,
          main: res.data.list,
          status: '成功'
        })
        wx.showToast({
          title: '发货成功',
          icon: 'none',
          duration: 1500
        })

      })
      .catch((err) => {
        wx.showToast({
          title: err.data.msg,
          icon: 'none',
          duration: 1500
        })
        _this.setData({
          status: '失败'
        })
      })
      }
    })

  }
})