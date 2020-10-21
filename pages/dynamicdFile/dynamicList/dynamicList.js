// pages/dynamicdFile/dynamicList/dynamicList.js
const utils = require('../../../common/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataNone: false,
    noMore: false,
    isHideLoadMore: true,
    pageNum: 1,
    pageSize: 1,
    hidemodel: true,
    list: {
      // 0: {
      //   id:'0001',
      //   title: '上半年开播',
      //   content: '与2017年的“网剧大年”相比，2018年上半年的网剧市场俨然进入了繁华后的平缓的过渡，整体态势较为平淡。一个明显的现象是，截止目前，去年《白夜追凶》《河神》等“制作精良+口碑爆棚”的网剧还未出现。而且根据骨朵的数据显示，排在点击量前两位的依旧是《烈火如歌》和《独孤天下》。',
      //   image: 'https://img.huxiucdn.com/article/cover/201808/09/084034860198.jpg?imageView2/1/w/710/h/400/|imageMogr2/strip/interlace/1/quality/85/format/jpg',
      //   videoImage: 'https://img.huxiucdn.com/article/cover/201808/09/084034860198.jpg?imageView2/1/w/710/h/400/|imageMogr2/strip/interlace/1/quality/85/format/jpg',
      //   hot: true,
      //   time: '2018 08 09',
      //   author: '发布者'
      // },
      // 1: {
      //   id: '0002',
      //   title: '上半年开播144部新网剧，可70%都成了炮灰',
      //   content: '与2017年的“网剧大年”相比，2018年上半年的网剧市场俨然进入了繁华后的平缓的过渡，整体态势较为平淡。一个明显的现象是，截止目前，去年《白夜追凶》《河神》等“制作精良+口碑爆棚”的网剧还未出现。而且根据骨朵的数据显示，排在点击量前两位的依旧是《烈火如歌》和《独孤天下》。',
      //   image: '',
      //   videoImage: '',
      //   hot: true,
      //   time: '2018 08 09',
      //   author: '发布者007'
      // },
      // 2: {
      //   id: '0003',
      //   title: '上半年开播144部新网剧，可70%都成了炮灰,与2017年的',
      //   content: '与2017年的“网剧大年”相比，2018年上半年的网剧市场俨然进入了繁华后的平缓的过渡，整体态势较为平淡。一个明显的现象是，截止目前，去年《白夜追凶》《河神》等“制作精良+口碑爆棚”的网剧还未出现。而且根据骨朵的数据显示，排在点击量前两位的依旧是《烈火如歌》和《独孤天下》。',
      //   image: 'https://img.huxiucdn.com/article/cover/201808/09/084034860198.jpg?imageView2/1/w/710/h/400/|imageMogr2/strip/interlace/1/quality/85/format/jpg',
      //   videoImage: '',
      //   hot: false,
      //   time: '2018 08 09',
      //   author: '发布者006'
      // },
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    this.onPullDownRefresh();
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

  recommendList:function() {
    var that = this;
    utils.ajax({
      url: '/xcx/near/recommend/list',
      method: 'get',
      success: function (res) {
        if (res.data.code == '1') {
          var dataList = res.data.data;
          if (dataList.length > 0) {
            var list = that.data.list;
            var temp
            for (var i = 0; i < dataList.length; i++) {
              temp = {};
              temp["id"] = dataList[i].id;
              temp["title"] = dataList[i].title;
              temp["content"] = dataList[i].context;
              if (dataList[i].photoUrls != null) {
                temp["image"] = (dataList[i].photoUrls.split(','))[0];
              }
              if (dataList[i].coverUrl != null) {
                temp["videoImage"] = dataList[i].coverUrl;
              }
              temp["hot"] = dataList[i].isRecommend;
              if (dataList[i].author != null) {
                temp["author"] = dataList[i].author;
              }
              temp["time"] = dataList[i].createTime;
              list.push(temp);
            }
            that.setData({
              list: list,
            })
          }
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      pageNum: 1,
      pageSize: 10,
      list: [],
      dataNone: false,
      noMore: false,
      isHideLoadMore: true,
    })
    this.recommendList();
    this.page(this.data.pageNum, this.data.pageSize);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if (!that.data.noMore) {
      that.setData({
        isHideLoadMore: false
      });
      wx.showLoading({
        title: '加载中',
      }) 
     that.page(that.data.pageNum, that.data.pageSize);
    }
    // console.log(1)
  },

  //获取数据
  page: function (pageNum, pageSize) {
    var that = this;
    utils.ajax({
      url: "/xcx/near/list",
      data: {
        lng: wx.getStorageSync('lon'),
        lat: wx.getStorageSync('lat'),
        pageNum: pageNum,
        pageSize: pageSize,
        // memberId: that.data.memberId
      },
      method: "post",
      success: function (res) {
        var dataList = res.data.data.data;
        // console.log(dataList)
        if (dataList.length > 0) {
          var list = that.data.list;
          var temp
          for (var i=0;i<dataList.length;i++) {
            temp = {};
            temp["id"] = dataList[i].id;
            temp["title"] = dataList[i].title;
            temp["content"] = dataList[i].context;
            if (dataList[i].photoUrls!=null){
              temp["image"] = (dataList[i].photoUrls.split(','))[0];
            }
            if (dataList[i].coverUrl!=null){
              temp["videoImage"] = dataList[i].coverUrl;
            }
            temp["hot"] = dataList[i].isRecommend;
            if (dataList[i].author!=null){
              temp["author"] = dataList[i].author;
            }
            temp["time"] = dataList[i].createTime;
            list.push(temp);
          }
      
          that.setData({
            list: list,
          })
          wx.hideLoading()


          //获取的数据数量小于pageSize  默认为最后一页
          if (dataList.length < pageSize) {
            that.setData({
              noMore: true,
              dataNone: false,
              isHideLoadMore: true,
            })
            console.log('没有更多了')
          } else {
            //页数加1
            that.setData({
              pageNum: pageNum + 1,
            })
          }
        } else {
          if (pageNum == 1) {
            //第一次无记录
            that.setData({
              dataNone: true,
            })
          } else {
            that.setData({
              noMore: true,
              dataNone: false,
              isHideLoadMore: true,
            })
          }
        }
      },
      complete: function () {
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh(); //停止下拉刷新
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //跳转到详情页
 todynamicDetail2: function (e) {
    var tradeNo = e.currentTarget.dataset.tradeno;
    wx.navigateTo({
      url: '../dynamicDetail2/dynamicDetail2?tradeNo=' + tradeNo
    })
  }
})