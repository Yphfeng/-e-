// pages/wallet/refund.js
var qbPayment = require('../../../common/newService/payment.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refundBTNDisable: true,
    userMoney: parseFloat(0.00).toFixed(2),
    refundMoney: parseFloat(0.00).toFixed(2),
    isExcess: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (parseFloat(options.userMoney).toFixed(2) > 0.00) {
      this.setData({
        userMoney: parseFloat(options.userMoney).toFixed(2)
      })
    }
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
  // onShareAppMessage: function () {

  // }

  bindInputEvent: function (e) {

    if (e.detail.cursor > 0) {
      if ((parseFloat(e.detail.value).toFixed(2) <= parseFloat(this.data.userMoney).toFixed(2)) && parseFloat(this.data.userMoney).toFixed(2) > 0.00 ){

        this.setData({
          refundBTNDisable: false,
          isExcess: false,
          refundMoney: e.detail.value
        })
      } else {
        this.setData({
          refundBTNDisable: true,
          isExcess: true,
          refundMoney: '0.00'
        })
      }
    } else {
      this.setData({
        refundBTNDisable: true,
        isExcess: false,
        refundMoney: '0.00'
      })
    }
  },

  refundEvent: function () {

    wx.showToast({
      icon: 'none',
      title: '正在调试中',
    })

    // qbPayment.refund(this.data.refundMoney + '', function (res) {
    //   if (res.data.status == 1) {
    //     wx.showModal({
    //       title: '提现成功',
    //       content: '请稍后在微信钱包中查看',
    //       success: function(res) {
    //         wx.navigateBack({ })
    //       }
    //     })
    //   } else {
    //     wx.showToast({
    //       title: '提现失败',
    //     })
    //   }
    // }, function (err) {
    //   wx.showToast({
    //     title: '提现失败',
    //   })
    // })
  }
})