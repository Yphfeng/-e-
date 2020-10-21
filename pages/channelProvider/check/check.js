// pages/merchants/check/check.js
import getAjax from '../../../common/getAjax.js';

const app = getApp();
// var page = 1;
// var GetList = function (that) {
//   getAjax.getPost("/Weixin/DealerStore/auditStoreList", { page: page, armariumScienceSession: that.data.token, examine_status:0})
//   .then((res) => {
//     var listData = that.data.listData;
//     if(res.data.status == 1) {
//       for (var i = 0; i < res.data.list.store_user_data.length; i++) {
//         listData.push(res.data.list.store_user_data[i]);
//       }
//       that.setData({
//         listData: listData,
//       });
//     }
//   })
//   .catch((err) => {

//   })
// }
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    scrollTop: '',
    listData: [],
    params: {},
    token: '',
    listSelect:['全部','无退货','有退货'], //下拉框列表
    selectIndex:0, //当前选中的值,
    pageIndex:1, //当前选中的页数
    showSelect:false, //下拉框是否显示
    pageNum:0 //数据总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var token = wx.getStorageSync("user").token;
    this.setData({
      token: token
    })
    wx.getSystemInfo({
      success: (res) => {
        _this.setData({
          height: res.windowHeight
        })
      }
    });
    getAjax.getPost("/Weixin/DealerStore/auditStoreList", { page: 1, armariumScienceSession: _this.data.token, examine_status:0 }).then((res) => {
      console.log(res.data.list);
      _this.setData({
        listData: res.data.list.store_user_data,
        pageNum: Math.ceil(res.data.list.store_user_num/10),
      })
    }).catch((err) => {
      wx.showToast({
        title: err.data.msg,
        icon: 'success',
        duration: 300
      });
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

  // 页面相关事件
  showchange:function(){
    this.setData({
      showSelect:!this.data.showSelect
    })
  },
  // 点击分类
  changeIndex:function(event){
    var index = event.currentTarget.dataset['index'];
    var _this = this;
    this.setData({
      selectIndex: index,
      showSelect:false,
      pageIndex:1,
      
      
    })
    getAjax.getPost("/Weixin/DealerStore/auditStoreList", { page: 1, armariumScienceSession: _this.data.token, examine_status: index }).then((res) => {
      _this.setData({
        listData: res.data.list.store_user_data,
        pageNum: Math.ceil(res.data.list.store_user_num / 10),
      })
    }).catch((err) => {
      _this.setData({
        pageNum:0
      })

      wx.showToast({
        title: err.data.msg,
        icon: 'success',
        duration: 2000
      });
    })
  },
  // 进入列表详情页
  goproduct:function(event){
    var id = event.currentTarget.dataset['index'];
    wx.navigateTo({
      url: '/pages/channelProvider/srgoods/srgoods?id=' + id
    })
  },

  // 改变页数
  changepage(e){
    this.setData({
      pageIndex: e.detail
    })
    this.getdata(e.detail, this.data.token);
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
    var that = this;
    page++;
    GetList(that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  refresh: function (event) {
    if (this.data.scrollTop < -100) {
    page = 1;
    this.setData({
      listData: [],
      scrollTop: 0
    });
    GetList(this)
    }
  },
  lower() {
    var that = this;
    page++;
    GetList(that);
  },
  send: function (e) {
    var id = e.target.dataset.uid;
    wx.navigateTo({
      url: '/pages/channelProvider/send/send?id='+id
    })
  },
  getdata(page,token){
    getAjax.getPost("/Weixin/DealerStore/auditStoreList", { page: page, armariumScienceSession: token, examine_status: this.data.selectIndex }).then((res) => {
      this.setData({
        listData: res.data.list.store_user_data,
        pageNum: Math.ceil(res.data.list.store_user_num / 10),
      })
    }).catch((err) => {
      wx.showToast({
        title: err.data.msg,
        icon: 'success',
        duration: 2000
      });
    })
  }

})