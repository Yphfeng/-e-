// pages/mineFile/shop/userAddress/userAddressList.js
let mailService = require('../../../../common/newService/userMailAddressService.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({ })
    this.getMailAddress();
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


  addAddressEvent: function () {
    const self = this;
    wx.authorize({
      scope: 'scope.address',
      success: function (res) {

        wx.chooseAddress({
          success: function (res) {
            console.log(res);
            if (res.errMsg == "chooseAddress:ok") {
              wx.showToast({
                icon: "loading",
              })
              self.addMailAddress(res);
            }
          }
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '添加地址失败',
          content: '前往设置,允许通讯录地址',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({})
            }
          }
        })
      },
      complete: function (res) { },
    })
  },
  addMailAddress: function (res) {
    const self = this;
    mailService.addMailAddress({
      title: "",
      mail_address: res.provinceName + res.cityName + res.countyName + res.detailInfo + ",  " + res.nationalCode,
      name: res.userName,
      mobile: res.telNumber
    }, function (res) {
      if (res.data.status == 1) {
        self.getMailAddress();
      } else {
        wx.hideLoading();
        wx.showToast({
          icon: "none",
          title: '上传失败',
        })
      }
    }, function (err) {
      wx.hideLoading();
      wx.showToast({
        icon: "none",
        title: '网络出错',
      })
    })
  },
  getMailAddress: function () {

    const localAddress = wx.getStorageSync("userMailAddress");
    const self = this;
    mailService.getMailAddress(function (res) { // 获取用户邮寄地址列表
      if (res.data.status == 1) {
        if (typeof res.data.address == 'array' && typeof localAddress == 'object') {
          res.data.address.forEach(v => {
            if (v.id = localAddress.id) {
              v.checked = true;
            }
          })
        }
        self.setData({
          address: res.data.address
        })
      }
      wx.hideLoading();
    }, function (err) {
      wx.hideLoading();
      wx.showToast({
        icon: "none",
        title: '网络出错',
      })
    })

  },

  radioChange: function(e) {
    const addressList = this.data.address;
    addressList.forEach(v => {
      if (v.id == e.detail.value) {
        wx.setStorage({
          key: 'userMailAddress',
          data:v,
        })
      }
    })
  }
})