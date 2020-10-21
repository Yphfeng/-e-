// pages/channelProvider/rgoods/rgoods.js
import getAjax from '../../../common/getAjax.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    datainfo:'',
    datasum:'',
    token:'',
    sinfo:'',//设备信息
    device_sn:'',//设备编号  
    datainfo_time:''//租赁期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      this.setData({
        id: options.id,
        datasum: options.sum
      })
    }
    
    var token = wx.getStorageSync("user").token;
    this.setData({
      token: token
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
  // 页面相关函数
  scancode:function(){
    wx.scanCode({
      success:(res)=>{
        var device_sn = res.result;
        this.setData({
          device_sn: res.result
        })
        var _this = this;
        getAjax.getPost("/Weixin/DealerStore/deviceInfo", { armariumScienceSession: _this.data.token, store_id: this.data.id, device_sn: device_sn}).then((res) => {
          if (res.data.list.sale_status==0){
            res.data.list.sale_status = "未租赁"
          } else if (res.data.list.sale_status == 1){
            res.data.list.sale_status = "租赁期"
          } else if (res.data.list.sale_status == 2) {
            res.data.list.sale_status = "已销售"
          }
          this.setData({
            sinfo:res.data.list
          })
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }).catch((err) => {
          wx.showToast({
            title: err.data.msg,
            icon: 'success',
            duration: 2000
          });
        })
      },fail:(res)=>{
        
      }
      
    })
  },
  enterrtn:function(){
    if (this.data.device_sn!=""){
      var _this = this;
      getAjax.getPost("/Weixin/DealerStore/returnReview", { armariumScienceSession: _this.data.token, store_id: this.data.id, device_sn: this.data.device_sn }).then((res) => {
        this.setData({
          device_sn: '',
          sinfo: '',
          datasum: this.data.datasum - 1
        })
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        });
      }).catch((err) => {
        wx.showToast({
          title: err.data.msg,
          icon: 'success',
          duration: 2000
        });
      })
    }else{
      wx.showToast({
        title: "请扫描设备",
        icon: 'success',
        duration: 2000
      });
    }
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