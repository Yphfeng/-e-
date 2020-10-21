// pages/channelProvider/returndevice/returndevice.js
import getAjax from '../../../common/getAjax.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    addtime:'',
    device_sn:'',
    datasum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  scancode: function () {
    wx.scanCode({
      success: (res) => {
        var device_sn = res.result;
        this.setData({
          device_sn: res.result
        })
        var _this = this;
        getAjax.getPost("/Weixin/DealerStore/getDeviceInfo", { armariumScienceSession: _this.data.token, device_sn: device_sn }).then((res) => {
          this.setData({
            sinfo: res.data.list[0]
          })
          this.setData({
            addtime: timetrans(this.data.sinfo.add_time)
          })
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
        }).catch((err) => {
          wx.showToast({
            title: err.data.msg,
            icon: 'success',
            duration: 2000
          });
        })
      }, fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      }

    })
  },
  enterrtn:function(){
    console.log(this.data.device_sn);
    if (this.data.device_sn!=""){
      getAjax.getPost("/Weixin/DealerStore/deviceBack", { armariumScienceSession: this.data.token, device_sn: this.data.device_sn }).then((res) => {
        this.setData({
          sinfo: "",
          device_sn:"",
          addtime:"",
          datasum:this.data.datasum+1
        })
        wx.showToast({
          title: '回收成功',
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
    }else{
      wx.showToast({
        title: "请扫描商品",
        icon: 'success',
        duration: 2000
      });
    }
    
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
  
  }
})
function timetrans(date) {
  var date = new Date(date * 1000);//如果date为13位不需要乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y + M + D + h + m + s;
}