// pages/mineFile/integral/withDraw/withDraw.js
import getAjax from '../../../../common/getAjax.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remoney:'',
    isshow:true,
    getmoney:'',
    showworing:true,
    token: "",
    nowdata:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      remoney: options.remoney
    })
    var token = wx.getStorageSync("user").token;
    this.setData({
      token: token
    })
    var nowdata = new Date();
    var nowd = nowdata.getTime() / 1000;
    this.setData({
      nowdata: this.timestampToTime(nowd, 0)
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
  //点击申请体现
  getmoney(){
    if (/^\d+(\.\d{1,2})?$/.test(this.data.getmoney)) {
      this.getdata(this.data.token, this, this.data.getmoney, this.data.remoney);
    }else{
      wx.showToast({
        title:"请输入正确数字",
        duration: 1000
      });
    }
  },
  changegetnum(e){
    this.setData({
      getmoney: e.detail.value
    })
    if (Number(this.data.getmoney) > Number(this.data.remoney)){
          this.setData({
            showworing:false
          })
      }else{
        this.setData({
          showworing: true
        })
      }
  },
  getdata(token, _this, money, balance) {
    getAjax.getPost("/Weixin/HealthAmbassador/withdrawals", { armariumScienceSession: token, money: money, balance: balance}).then((res) => {
      wx.showToast({
        title: "申请成功",
        icon: 'success',
        duration: 1000
      });
      _this.setData({
        isshow:false
      })
    }).catch((err) => {
      wx.showToast({
        title: err.data.msg,
        icon: 'success',
        duration: 1000
      });
    })
  },
  // 时间戳变换
  timestampToTime(timestamp, typ) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes();
    if (typ == 0) {
      return Y + M + D
    } else {
      return Y + M + D + h + m;
    }

  },
})