// pages/dynamicdFile/dynamicEditVideo/dynamicEditVideo.js
const utils = require('../../../common/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    longitude: '', // 经度
    latitude: '',  // 纬度
    id: '',
    mapShare: '',
    user:[],
    videoSrc:'',
    videoiamgeSrc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var lon = wx.getStorageSync('lon');
    var lat = wx.getStorageSync('lat');
    var user = wx.getStorageSync('user');
    this.setData({
      user: user,
      longitude: lon,
      latitude: lat
    })
    console.log("user", user);
    console.log("longitude", lon);
    console.log("latitude", lat);
    if (options.tradeNo) {
      this.setData({
        id: options.tradeNo
      })
      var that = this;
      console.log('id', this.data.id);
      utils.ajax({
        url: '/xcx/near/detail',
        data: { id: options.tradeNo },
        method: 'get',
        success: function (res) {
          console.log('res', res);
          if (res.data.code == '1') {
            that.setData({
              mapShare: res.data.data,
              videoSrc: res.data.data.videoUrl,
              videoiamgeSrc: res.data.data.coverUrl
            })
            wx.setNavigationBarTitle({
              title: '编辑视频',
            })
          }
        }
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
    //获取定位
    var self=this;
    wx.getLocation({
      success: function (res) {
        console.log(res)
        self.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      }
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
  changeTitle:function(e){
    this.setData({
      title: e.detail.value
    })
  }, 
  changeContent: function (e) {
    this.setData({
      content: e.detail.value
    })
    //console.log(this.data.content)
  },
  //选择封面图片
  chooseImage:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: utils.domain() + '/api/upload',
          filePath: tempFilePaths[0], //图片路径
          name: 'file',
          formData: {},
          success: function (res) {
            // 微信上传返回的值是string类型，所以要转化成字符串
            var data = JSON.parse(res.data);
            if (data.code == '1') {
              console.log('data', data.data);
              that.setData({
                videoiamgeSrc: data.data
              })
            }
          }
        })
      }
    })
  },
  //选择视频
  chooseVideo:function(){
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log("res",res);
        wx.showLoading({
          title: '视频处理中',
        })
        wx.uploadFile({
          url: utils.domain() + '/api/upload',
          filePath: res.tempFilePath, // 视频路径
          name: 'file',
          formData: {},
          success: function (res) {
            // 微信上传返回的值是string类型，所以要转化成字符串
            var data = JSON.parse(res.data);
            console.log('222res', data);
            that.setData({
              videoSrc: data.data
            })
            wx.hideLoading();
            console.log('videoSrc', that.data.videoSrc);
          }
        })
        
      }
    })
  },
  //删除视频或视频封面图
  delete:function(e){
    if (e.currentTarget.dataset.type =='videoiamgeSrc'){
      this.setData({
        videoiamgeSrc:''
      })
    }
    else{
      this.setData({
        videoSrc: ''
      })
    }
  },
  // 提交
  submit:function(e){
    console.log('e',e);
    var that = this;
    console.log('videoiamgeSrc', that.data.videoiamgeSrc);
    var requestFrom = {
      token: that.data.user.token,
      title: e.detail.value.title,
      context: e.detail.value.context,
      videoUrl: that.data.videoSrc,
      coverUrl: that.data.videoiamgeSrc,
      longitude: that.data.longitude,
      latitude: that.data.latitude
    };
    var check = this.check(requestFrom);
    if (check) {
      if (!that.data.mapShare.id) {
         // 添加
        utils.ajax({
          url: '/xcx/user/save',
          data: requestFrom,
          method: 'post',
          success: function (res) {
            console.log('res', res);
            if (res.data.code == '1') {
              wx.showModal({
                title: '',
                content: '已提交审核，请耐心等待',
                success: function (res) {
                  wx.navigateTo({
                    url: '../dynamicMine/dynamicMine'
                  })
                }
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              });
            }
          }
        })
      } else {
        // 编辑或重新发布
        var url = '';
        if (that.data.mapShare.statusCode == '3') {
          // 用户重新发布
          url = '/xcx/user/republish';
        } else {
          // 用户编辑
          url = '/xcx/user/edit';
        }
        utils.ajax({
          url: url,
          data: {
            id: that.data.mapShare.id,
            token: that.data.user.token,
            title: e.detail.value.title,
            context: e.detail.value.context,
            videoUrl: that.data.videoSrc,
            coverUrl: that.data.videoiamgeSrc,
            longitude: that.data.longitude,
            latitude: that.data.latitude
          },
          method: 'post',
          success: function (res) {
            console.log('res', res);
            if (res.data.code == '1') {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              });
              wx.navigateBack();
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              });
            }
          }
        })
      }
    }
  },
  // 提交到后台时，先进行表单验证
  check: function (param) {
    if (!param.title) {
      wx.showToast({
        title: "请填写标题",
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (!param.videoUrl) {
      wx.showToast({
        title: "请上传视频",
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (!param.coverUrl) {
      wx.showToast({
        title: "请上传视频封面",
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (!param.context) {
      wx.showToast({
        title: "请填写内容",
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    return true;
  },
})