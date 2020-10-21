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
    pageSize: 10,
    hidemodel: true,
    user: [],
    requestForm: '',
    list: {
      // 0: {
      //   id: '0001',
      //   title: '上半年开播',
      //   content: '与2017年的“网剧大年”相比，2018年上半年的网剧市场俨然进入了繁华后的平缓的过渡，整体态势较为平淡。一个明显的现象是，截止目前，去年《白夜追凶》《河神》等“制作精良+口碑爆棚”的网剧还未出现。而且根据骨朵的数据显示，排在点击量前两位的依旧是《烈火如歌》和《独孤天下》。',
      //   image: 'https://img.huxiucdn.com/article/cover/201808/09/084034860198.jpg?imageView2/1/w/710/h/400/|imageMogr2/strip/interlace/1/quality/85/format/jpg',
      //   videoImage: 'https://img.huxiucdn.com/article/cover/201808/09/084034860198.jpg?imageView2/1/w/710/h/400/|imageMogr2/strip/interlace/1/quality/85/format/jpg',
      //   status:'已通过',
      //   time: '2018 08 09',
      //   author: '发布者'
      // },
      // 1: {
      //   id: '0002',
      //   title: '上半年开播144部新网剧，可70%都成了炮灰与2017年的“网剧大年”相比',
      //   content: '与2017年的“网剧大年”相比，2018年上半年的网剧市场俨然进入了繁华后的平缓的过渡，整体态势较为平淡。一个明显的现象是，截止目前，去年《白夜追凶》《河神》等“制作精良+口碑爆棚”的网剧还未出现。而且根据骨朵的数据显示，排在点击量前两位的依旧是《烈火如歌》和《独孤天下》。',
      //   image: '',
      //   videoImage: '',
      //   status: '审核中',
      //   time: '2018 08 09',
      //   author: '发布者007'
      // },
      // 2: {
      //   id: '0003',
      //   title: '是他吗?《延喜攻略》帅气傅恒在《还珠》里长这样',
      //   content: '《延喜攻略》开播至今，网络累积播放量已突破31亿，不管是剧情、演员都掀起热议，也连带捧红不少新人。大陆男星许凯仅23岁，模特儿出身的他，因在剧中饰演帅气又深情的“富察傅恒”一角而爆红，也引发不少人好奇搜寻其他各剧“傅恒”的扮演者，更一度登上微博热搜第一。',
      //   image: 'http://n.sinaimg.cn/ent/transform/200/w600h400/20180809/YXPw-hhkusku2389287.jpg',
      //   videoImage: '',
      //   status:'未通过',
      //   msg:'文章内容有问题，请修改后重新发布',
      //   time: '2018 08 09',
      //   author: '发布者006'
      // },
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user = wx.getStorageSync('user');
    this.setData({
      user: user,
      requestForm: user.token
    })
    this.onPullDownRefresh();
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      pageNum: 1,
      pageSize: 10,
      list: [],
      dataNone: false,
      noMore: false,
      isHideLoadMore: true,
    })
    this.page(this.data.pageNum, this.data.pageSize, this.data.checkedList, this.data.requestForm);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (!that.data.noMore) {
      that.setData({
        isHideLoadMore: false
      });
      that.page(that.data.pageNum, that.data.pageSize, that.data.checkedList, this.data.requestForm);
    }
  },

  page: function (pageNum, pageSize, escortIds, requestForm) {
    var that = this;
    var url = "/xcx/user/mine/article?pageNum=" + pageNum + "&pageSize=" + pageSize;
    if (requestForm) {
      url = url + "&token=" + requestForm;
    }
    utils.ajax({
      url: url,
      method: "get",
      success: function (res) {
        var dataList = res.data.data.data;
        if (dataList.length > 0) {
          var list = that.data.list;
          var temp
          for (var i = 0; i < dataList.length; i++) {
            // console.log('dataList', dataList[i]);
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
            temp["status"] = dataList[i].statusName;
            temp["msg"] = dataList[i].auditReason;
            if (dataList[i].author != null) {
              temp["author"] = dataList[i].author;
            }
            temp["time"] = dataList[i].createTime;
            list.push(temp);
          }
          that.setData({
            list: list,
          })
          //获取的数据数量小于pageSize  默认为最后一页
          if (dataList.length < pageSize) {
            that.setData({
              noMore: true,
              dataNone: false,
              isHideLoadMore: true,
            })
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
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  bindshowModel:function(e){
    //审核未通过原因
    wx.showModal({
      title: '',
      content: e.currentTarget.dataset.msg,
      showCancel:false,
      success: function (res) {
        // if (res.confirm) {
        //   console.log('用户点击确定')
        // }
      }
    })
  },
  //跳转到详情页
  todynamicDetail2: function (e) {
    var tradeNo = e.currentTarget.dataset.tradeno;
    wx.navigateTo({
      url: '../dynamicDetail2/dynamicDetail2?tradeNo=' + tradeNo
    })
  },

  //跳转到修改页面
  change: function (e) {
    var tradeNo = e.currentTarget.dataset.tradeno;
    var image = e.currentTarget.dataset.image;
    if (!image) {
      wx.navigateTo({
        url: '../dynamicEditVideo/dynamicEditVideo?tradeNo=' + tradeNo
      })
    } else {
      wx.navigateTo({
        url: '../dynamicEdit/dynamicEdit?tradeNo=' + tradeNo
      })
    }
    
  },

  // 删除
  delete:function(e){
    var that = this;
    console.log(e);
    wx.showModal({
      title: '',
      content: '删除此内容',
      success: function (res) {
        if (res.confirm) {
          utils.ajax({
            url:'/xcx/user/delete',
            data: { 
              token: that.data.requestForm,
              id: e.target.dataset.id
            },
            method:'get',
            success:function(res) {
              console.log('res',res);
              if (res.data.code == '1') {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
                that.onPullDownRefresh();
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon:'none'
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})