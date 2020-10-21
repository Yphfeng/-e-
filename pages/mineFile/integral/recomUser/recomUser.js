// pages/mineFile/integral/recomUser/recomUser.js
import getAjax from '../../../../common/getAjax.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    types:'0',
    nowdata:'',  //当前时间
    token:"",   
    pagesum:1,  //总页数
    pageIndex:1,  //当前页数
    datalist:"",  //信息列表
    datasum:""  //用户总数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nowdata = new Date();
    var nowd = nowdata.getTime()/1000;
    this.setData({
      nowdata: this.timestampToTime(nowd,0)
    })

    var _this = this;
    var token = wx.getStorageSync("user").token;
    this.setData({
      token: token
    })

    // this.getdata(this.data.token, 1,_this);
    this.getnowdata(this.data.token, 1, _this)
    
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
  // 改变类型
  changetypes(e){
    var _this = this;
    this.setData({
      types: e.currentTarget.dataset.typeindex,
      pageIndex:1
    })
    if (this.data.types == 0) {
      this.getnowdata(this.data.token, 1, _this)
    } else if (this.data.types == 1) {
      this.getdata(this.data.token, 1, _this);
    }
    
  },
  // 改变页数
  changepage(e){
    this.setData({
      pageIndex:e.detail
    })
    var _this = this;
    if (this.data.types==0){
      this.getnowdata(this.data.token, this.data.pageIndex, _this)
    }else if(this.data.types == 1){
      this.getdata(this.data.token, this.data.pageIndex, _this);
    }
  },
  // 时间戳变换
  timestampToTime(timestamp,typ) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes();
    if (typ==0){
      return Y + M + D
    }else{
      return Y + M + D + h + m;
    }
    
  },
  getdata(token,page,_this){
    getAjax.getPost("/Weixin/HealthAmbassador/recommendedTotal", { page: page, armariumScienceSession: token}).then((res) => {
      var dainfo = res.data.list.user_info;
      for (var i = 0; i < dainfo.length;i++){
        // console.log(dainfo[i].add_time);
        dainfo[i].reg_time = _this.timestampToTime(parseInt(dainfo[i].reg_time),1)
      }
      _this.setData({
        datasum: res.data.list.num,
        datalist: dainfo,
        pagesum: Math.ceil(res.data.list.num / 10),
      })
    }).catch((err) => {
      _this.setData({
        datasum: 0,
        datalist: "",
        pagesum: 1,
      })
      // wx.showToast({

      //   title: err.data.msg,
      //   icon: 'success',
      //   duration: 2000
      // });
    })
  },
  getnowdata(token, page, _this) {
    getAjax.getPost("/Weixin/HealthAmbassador/todayRecommends", { page: page, armariumScienceSession: token }).then((res) => {
      var dainfo = res.data.list.user_info;
      for (var i = 0; i < dainfo.length; i++) {
        // console.log(dainfo[i].add_time);
        dainfo[i].reg_time = _this.timestampToTime(parseInt(dainfo[i].reg_time), 1)
      }
      _this.setData({
        datasum: res.data.list.num,
        datalist: dainfo,
        pagesum: Math.ceil(res.data.list.num / 10),
      })
    }).catch((err) => {
      _this.setData({
        datasum:0,
        datalist: "",
        pagesum: 1,
      })
      // wx.showToast({
      //   title: err.data.msg,
      //   icon: 'success',
      //   duration: 2000
      // });
    })
  }
})