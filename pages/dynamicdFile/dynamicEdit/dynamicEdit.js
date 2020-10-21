// pages/dynamicEdit/dynamicEdit.js
const utils = require('../../../common/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAddress: "",
    images: [],
    longitude: '', // 经度
    latitude: '',  // 纬度
    id:'',
    mapShare:'',
    title:'',
    picList: []
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
    console.log("options", options);
    if (options.tradeNo) {
      this.setData({
        id: options.tradeNo
      })
      var that = this;
      console.log('id',this.data.id);
      utils.ajax({
        url:'/xcx/near/detail',
        data: { id: options.tradeNo},
        method:'get',
        success:function(res) {
          console.log('res',res);
          if (res.data.code == '1') {
            var photoUrls = res.data.data.photoUrls;
            var urls = photoUrls.split(',');
            console.log('urls',urls);
            that.setData({
              mapShare:res.data.data,
              picList: urls
            })
            wx.setNavigationBarTitle({
              title: '编辑图文',
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
  // 用户点击添加图片
  chooseImage:function(){
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log('res',res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // newList.push(tempFilePaths)
        for (var i = 0; i < tempFilePaths.length; i++) {
          console.log(i);
          if (i == tempFilePaths.length) {
            wx.hideLoading();
          }
          wx.uploadFile({
            url: utils.domain() + '/api/upload',
            filePath: tempFilePaths[i], //图片路径
            name: 'file',
            formData: {},
            success: function (res) {
              // 微信上传返回的值是string类型，所以要转化成字符串
              var data = JSON.parse(res.data);
              if (data.code == '1') {
                console.log('data', data.data);
                //  上传成功后将上传成功的地址返回，并拼接到集合里
                var newList = that.data.picList.concat(data.data);
                that.setData({
                  picList: newList,
                })
              }
            }
          })
        }
      }
    })
  },
  // 用户点击修改图片
  changeImage:function(e){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
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
              var newList = that.data.picList;
              for (var i = 0; i < newList.length; i++) {
                console.log(newList[i], e.currentTarget.dataset.src)
                if (newList[i] == e.currentTarget.dataset.src) {
                  // newList[i]= tempFilePaths;
                  newList.splice(i, 1, data.data);
                  that.setData({
                    picList: newList
                  })
                  console.log('picList', that.data.picList);
                }
              }
            }
          }
        })
      }
    })
  },
  //用户点击删除图片
  detailImage:function(e) {
    var that = this;
    wx.showModal({
      title: '',
      content: '确认删除图片',
      success: function (res) {
        if (res.confirm) {
          var newList = that.data.picList;
          for (var i = 0; i < newList.length; i++) {
            if (newList[i] == e.currentTarget.dataset.src) {
              newList.splice(i, 1)
              that.setData({
                picList: newList
              })
            }
          }
        }
      }
    })
  },
   // 用户点击修改内容
  changeContent:function(e) {
    var self = this;
    var newDetail = self.data.detailContent
    // for (var i=0;i<newDetail.length;i++){
    //   if (newDetail[i].id == e.currentTarget.dataset.id){
    //     newDetail[i].content = e.detail.value ;
    //     self.setData({
    //       detailContent: newDetail
    //     })
    //   }
    // }
  },
   // 修改title
  changeTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  }, 
  //点击提交按钮
  submit:function(e){
    var that = this;
    console.log("e",e);
    var urls = '';
    var newList = that.data.picList;
    if (newList != null) {
      for (var i = 0; i < newList.length; i++) {
        if (i == 0) {
          urls = newList[0];
        } else {
          urls = urls + "," + newList[i];
        }
      }
    }
    var requestFrom = {
      token:that.data.user.token,
      // token: '8cc0f72db2aeb43e04f484cff047d7233',
      title: e.detail.value.title,
      context: e.detail.value.context,
      photoUrls: urls,
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
            token:that.data.user.token,
            // token: '8cc0f72db2aeb43e04f484cff047d7233',
            title: e.detail.value.title,
            context: e.detail.value.context,
            photoUrls: urls,
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

  /**
   * 用户长按图片删除图片事件
   */
  delegateImageEvent: function () {

  },

  /**
   * 选择地址
   */
  chooseAddressEvent: function () {
    // 获取授权
    var self = this;
    wx.authorize({
      scope: 'scope.userLocation',
      success: function (res) {
        console.log('location',res);
        if (res.errMsg == 'authorize:ok') {
          // 获取用户地理位置
          wx.chooseLocation({
            success: function(res) {
              console.log(res);
              var name = res.name;
              var lat = res.latitude;
              var lon = res.longitude;
              self.setData ({
                userAddress: name
              })
            },
            cancel: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      }
    })
  }
})