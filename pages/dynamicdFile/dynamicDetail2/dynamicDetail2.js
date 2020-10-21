// pages/dynamicdFile/dynamicDetail2/dynamicDetail2.js
// let app = getApp();
const utils = require('../../../common/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // id: 0,
    // isShare:false,
    // videoSrc: '',
    // videoimageSrc: 'https://img.huxiucdn.com/article/cover/201808/09/084034860198.jpg?imageView2/1/w/710/h/400/|imageMogr2/strip/interlace/1/quality/85/format/jpg',
    // title: '委内瑞拉政府表示',
    // author: '发布者',
    // time: '2018 08 09',
    // content: '当地时间8月5日，委内瑞拉政府表示，已有六人因涉嫌用无人机刺杀总统马杜罗被逮捕，这一刺杀计划至少酝酿了半年。美国方面则表示，没有参与此次袭击。当地时间8月5日，委内瑞拉政府表示，已有六人因涉嫌用无人机刺杀总统马杜罗被逮捕，这一刺杀计划至少酝酿了半年。美国方面则表示，没有参与此次袭',
    // images:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options,'详情')
    wx.hideShareMenu()
    //获取文章id
    if (options.tradeNo) {
      let _id = JSON.parse(options.tradeNo)
      this.setData({
        id: _id
      })
    }
    //是否从分享链接进入
    if (options.isShare=='true'){
      this.setData({
        isShare:true
      })
    }

    var self = this;
    utils.ajax({
      url: "/xcx/near/detail",
      data: {
        id:self.data.id
      },
      method: "get",
      success: function (res) {
        if(res.data.code==1){
          var newdata = res.data.data;
          self.setData({
            id: newdata.id,
            videoSrc: newdata.videoUrl,
            videoimageSrc: newdata.coverUrl,
            title: newdata.title,
            author: newdata.author,
            time: newdata.createTime,
            content: newdata.context,
          })
          if (newdata.photoUrls!=null){
            var images = newdata.photoUrls.split(',');
            console.log(images.length)
            var newimages=[]
            var temp
            for (var i = 0; i < images.length;i++) {
              temp = {};
              temp["src"] = images[i];
              temp["isshow"] = false;
              newimages.push(temp);
            }
            console.log(newimages.length)
            self.setData({
              images: newimages
            })
          }
        }
        console.log(res,'详情页数据')
      }
    })    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //图片显示
  imageLoad:function(e){
   var index= e.currentTarget.dataset.imageindex
   var newimages = this.data.images;
   newimages[index].isload=true;
   this.setData({
      images: newimages
    })

  },
  //转发分享
  onShareAppMessage: function(res) {
    var self = this;
    var _id = self.data.id
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '百家益',
      // imageUrl: self.data.videoimageSrc,
      path: '/pages/dynamicdFile/dynamicDetail2/dynamicDetail2?tradeNo=' + _id+'&isShare=true'
    }
    
  },
  back:function(){
    wx.redirectTo({
      url:'/pages/home/home'
    })
   
  }

})