// pages/merchants/incomorder/incomorder.js
import getAjax from '../../../common/getAjax.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    pageindex:1,
    datasum:'',
    datalist:"",
    store_id:'',
    pagesum:'' //总页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var store_id = wx.getStorageSync('user').store_id;
    this.setData({
      id: store_id
    });
    this.getdata("/Weixin/Store/profitOrderList", this.data.id, 1);
    
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
 
  // 改变页数
  changepage(e) {
    this.setData({
      pageindex: e.detail
    })
    this.getdata("/Weixin/Store/profitOrderList", this.data.id, this.data.pageindex);
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

  // 获取数据
  getdata(url,id,page){
    getAjax.getPost(url, { store_id: id, page: page })
      .then((res) => {
        for (var i = 0; i < res.data.list.profit_info.length; i++) {
          res.data.list.profit_info[i].order_time = this.timestampToTime(res.data.list.profit_info[i].order_time);
        }
        this.setData({
          datasum: res.data.list.profit_num,
          datalist: res.data.list.profit_info,
          pagesum: Math.ceil(res.data.list.profit_num/10)
        })
       
      })
      .catch((err) => {

      })
  },
   timestampToTime(timestamp) {
     console.log(timestamp);
     if (timestamp == null){
       return "-";
     }
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    return Y + M + D;
  }
})