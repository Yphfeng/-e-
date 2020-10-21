// business.js
let businessService = require('../../../../common/newService/businessService.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      invite_total_num: 0,
      bind_device_num: 0,
      shop_balance_num: 0,
      directly_user_num: 0,
      invite_today_num: 0,
      invite_month_num: 0,
    },
    wholesaler_user: {
      total_num: 0,
      month_num: 0,
      today_num: 0
    },
    profit: {
      user_profit: 0,
      wholesaler_profit: 0,
      manage_profit: 0,
      total_profit: 0,
      today_profit: 0,
      month_profit: 0,
      account_profit: 0,
      withdraw_profit: 0,
    },
    device: {
      total_device_num: 0,
      bind_device_num: 0,
      effective_device_num: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sys = wx.getSystemInfoSync();
    this.setData({
      width: sys.windowWidth
    })
    let self = this;
    businessService.businessHomeData(function (res) {
      if (res.statusCode == 200 && res.data.status == 1) {
        self.setData({
          user: res.data.user,
          wholesaler_user: res.data.wholesaler_user,
          profit: res.data.profit,
          device: res.data.device
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.msg ? res.data.msg : '网络出错',
        })
      }
    }, function (err) {
      wx.showToast({
        icon: 'none',
        title: '网络出错',
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

  bindTap: function (e) {
    var url = "";
    switch (e.currentTarget.dataset.type) {
      case 'user':
        url = '../businessUsers/businessUsers'
        break;
      case 'device':
        url = '../businessDevices/businessDevices'
        break;
      case 'income':
        url = '../businessMoneys/businessMoneys'
        break;
      case 'business':
        url = '../subBusiness/subBusiness'
        break;
      default:
        return;
    }
    if (url.length == 0 || url == undefined) {
      return;
    }
    wx.navigateTo({
      url: url,
    })
  },

  applicationContainerAction(e) {

    let value = e.currentTarget.dataset.application;
    var url = "";
    switch (value) {
      case "deivces":
        url = '../businessDevices/businessDevices'
        break;
      case "users":
        url = '../businessUsers/businessUsers'
        break;
      case "finance":
        url = '../businessMoneys/businessMoneys'
        break;
      case "subBusiness":
        url = '../subBusiness/subBusiness'
        break
      default:
        break;
    }
    if (url.length == 0 || url == undefined) {
      return;
    }
    wx.navigateTo({
      url: url,
    })
  }
})