// pages/merchants/send/send.js
import getAjax from '../../../common/getAjax.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    token: '',
    store_num: '',
    main: {},
    device_code: '',
    status: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync("user").token;
    this.setData({
      id: options.id,
      token
    })
    getAjax.getPost("/Weixin/DealerStore/getDeliverNum", { armariumScienceSession: this.data.token, store_id: this.data.id })
    .then((res) => {
      if(res.data.status == 1) {
        this.setData({
          store_num: res.data.list.store_num
        })
      }else{
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
  formSubmit: function (e) {
    var _this = this;
    wx.scanCode({
      success: (res) => {
        var device_sn = res.result;
        var str = device_sn.slice(1,2);
        console.log(str);
        switch(str) {
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
        this.setData({
          device_code: device_code,
          device_sn: device_sn
        })
        getAjax.getPost('/Weixin/DealerStore/deliver', { device_sn: device_sn, armariumScienceSession: this.data.token,store_id: this.data.id })
          .then((res) => {
            if(res.data.status == 1){
              wx.showToast({
                title: '发货成功',
                icon: 'none',
                duration: 1500
              })
              var total_num = Number(_this.data.store_num) + 1;
              _this.setData({
                main: res.data.list,
                store_num: total_num,
                status: '成功'
              })
            }else{
              _this.setData({
                status: '失败'
              })
            }

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