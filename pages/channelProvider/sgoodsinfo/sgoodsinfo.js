// pages/channelProvider/sgoodsinfo/sgoodsinfo.js
import getAjax from '../../../common/getAjax.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    datasum:"",
    store_user_num:'',
    token:'',
    datalist:"",
    pageindex:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    var token = wx.getStorageSync("user").token;
    this.setData({
      token: token
    })
    this.getdata("/Weixin/DealerStore/getDeviceList", token, this.data.id, 1);

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
    this.getdata("/Weixin/DealerStore/getDeviceList", this.data.token, this.data.id, 1);
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
  // 页面相关函数
  gosend(){
    wx.navigateTo({
      url: "/pages/channelProvider/send/send?id="+this.data.id,
    })
  },
  // 改变页数
  changepage(e){
    this.setData({
      pageindex: e.detail
    })
    this.getdata("/Weixin/DealerStore/getDeviceList", this.data.token, this.data.id, this.data.pageindex);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
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
  getdata(url, token, id, page){
    var _this = this;
    
    getAjax.getPost(url, { armariumScienceSession: token, store_id: id, page: page }).then((res) => {
      console.log(res)
      _this.setData({
        datalist: res.data.device_info,
        datasum: Math.ceil(res.data.store_user_num/10),
        store_user_num: res.data.store_user_num
      })
    }).catch((err) => {
      console.log(err);
      _this.setData({
        datalist: [],
        datasum:1,
        store_user_num: 0
      })
      wx.showToast({
        title: err.data.msg,
        icon: 'success',
        duration: 2000
      });
    })
  }
})

