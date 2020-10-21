// pages/channelProvider/edit/edit.js
import getAjax from '../../../common/getAjax.js'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile_no: '',
    name: '',
    store_id : '',
    token: '',
    divide_into: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var token = wx.getStorageSync('user').token;
    this.setData({
      store_id: id,
      token
    })
    getAjax.getPost("/Weixin/DealerStore/divideInto", { store_id: id, armariumScienceSession: token})
    .then((res) => {
      this.setData({
        name: res.data.list[0].name,
        mobile_no: res.data.list[0].mobile_no,
        divide_into: res.data.list[0].divide_into,
      })
    })
    .catch((err) => {

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
  changeValue(e){
    this.setData({
      divide_into: e.detail.value
    })
  },
  edit(){
    getAjax.getPost("/Weixin/DealerStore/fixStoreDivideInto", { store_id: this.data.store_id, armariumScienceSession: this.data.token, divide_into: this.data.divide_into})
    .then((res) => {
      if(res.data.status == 1) {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '/pages/channelProvider/management/management'
          })
        },1500)
      }
      
    })
    .catch((err) => {

    }) 
  }
})