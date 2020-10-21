// invited.js
var mineService = require('../../../common/newService/mineService');
var app = getApp();
var userId = "";
var userType = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowImage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this;
    
    wx.showLoading({
      title: '正在加载图片',
    })
    wx.getStorage({
      key: 'user',
      success: function (res) {
        userId = res.data.user_id;
        userType = res.data.user_type;
      },
    })
    mineService.getUserQRCode(function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.data.status == 1) {
        self.setData({
          isShowImage: true,
          codeImageUrl:  res.data.url
        })
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
        })
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '获取二维码出错',
          content: '请稍后再试',
          success: function (res) {
            wx.navigateBack({})
          }
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
  onShareAppMessage: function (options) {
    
    const scene = 'userId:' + userId + '_userType:' + userType;
    return{
      path: '/pages/home/home?scene=' + scene,
      success: function(res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          wx.showToast({
            title: '分享成功',
          })
        }
      }
    }
  },

  downloadQRCodeEvent: function () {

    var self = this;
    if (wx.canIUse("saveImageToPhotosAlbum")) {
      wx.showModal({
        title: '是否下载二维码',
        content: '',
        success: function (res) {

          if (res.confirm) {

            wx.downloadFile({
              url: self.data.codeImageUrl,
              header: {
                'content-type': 'application/x-www-form-urlencode'
              },
              success: function (res) {
                if (res.errMsg != 'downloadFile:ok') {
                  wx.showToast({
                    title: '下载失败',
                  })
                  return;
                }

                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function (res) {
                    console.log(res);
                    if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
                      wx.showToast({
                        title: '保存成功,请在相册中查看',
                      })
                    } else {
                      wx.showToast({
                        title: '保存失败',
                      })
                    }
                  }
                })
              },
              fail: function (res) {
                wx.showToast({
                  title: '保存失败',
                })
              },
              complete: function (res) { },
            })
          }
        }
      })

    } else {

      wx.showModal({
        title: '请允许访问手机相册',
        content: '',
        success: function (res) {

          if (res.confirm) {
            wx.openSetting({})
          }
        }
      })
    }
  }
})