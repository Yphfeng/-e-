// pages/channelProvider/rgoodsinfo/rgoodsinfo.js
import getAjax from '../../../common/getAjax.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    token:'',
    datalist:'', // 总设备
    datasum:''//总条数
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync("user").token;
    this.setData({
      token: token
    })
    if (options.id){
      this.setData({
        id: options.id
      })
      var _this = this;
      getAjax.getPost("/Weixin/DealerStore/returnDeviceDetails", { armariumScienceSession: _this.data.token, store_id: options.id}).then((res) => {
       this.setData({
         datalist:res.data.list.return_info,
         datasum: res.data.list.return_num
       })
      }).catch((err) => {
        wx.showToast({
          title: err.data.msg,
          icon: 'success',
          duration: 300
        });
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
    getAjax.getPost("/Weixin/DealerStore/returnDeviceDetails", { armariumScienceSession: this.data.token, store_id: this.data.id }).then((res) => {
      console.log(res.data.list);
      if(res.data.status==1){
        this.setData({
          datalist: res.data.list.return_info,
          datasum: res.data.list.return_num
        })
      }
    }).catch((err) => {
      this.setData({
        datalist: [],
        datasum: 0
      })
      wx.showToast({
        title: err.data.msg,
        icon: 'success',
        duration: 300
      });
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
  // 页面相关函数
  gorgoods:function(){
    wx.navigateTo({
      url: "/pages/channelProvider/rgoods/rgoods?id="+this.data.id+'&sum='+this.data.datasum
    })
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
  
  }
})