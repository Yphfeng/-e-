// pages/dynamicdFile/dynamicdMain.js
// let dynamicdService = require('../../common/newService/dynamicdService.js');
const utils = require('../../common/util.js')
let _sys = wx.getSystemInfoSync();
let _width = _sys.windowWidth;
let _height = _sys.windowHeight - 70;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   hidemodel:true,
   scale:'',
   indexed:1,
        dataNavBar: [
            {
                id:0,
                pagePath: "/pages/home/home",
                text: "设备",
                iconPath: "../../images/home_normal.png",
                selectedIconPath: "../../images/home_selected.png"
            },
            {
                id:1,
                pagePath: "/pages/dynamicdFile/dynamicdMain",
                text: "动态",
                iconPath: "../../images/dynamic_normal@3x.png",
                selectedIconPath: "../../images/dynamic_selected@3x.png"
            },
            {
                id:2,
                pagePath: "/pages/mine/mine",
                text: "我的",
                iconPath: "../../images/mine_normal.png",
                selectedIconPath: "../../images/mine_selected.png"
            }
        ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var token = wx.getStorageSync("user").token;
    // console.log(token,'token')
    this.setData({
      width: _width,
      height: _height,
      markers: [],
      controls: [{
        id: 0,
        position: {
          left: _width / 2 - 40 / 2,
          top: _height / 2 - 40,
          width: 40,
          height: 40,
        },
        iconPath: '../../images/map_centerMark@3x.png',
        clickable: false
      }, {
        id: 1,
        position: {
          left: 10,
          top: _height - 10 - 60,
          width: 40,
          height: 40,
        },
        iconPath: '../../images/map_location@2x.png',
        clickable: true
      },
        {
          id: 2,
          position: {
            left: _width - 10 - 45,
            top: 150,
            width: 45,
            height: 48,
          },
          iconPath: '../../images/map_edit@2px.png',
          clickable: true
        }, {
          id: 3,
          position: {
            left: _width - 10 - 45,
            top: 30,
            width: 45,
            height: 48,
          },
          iconPath: '../../images/map_list@2x.png',
          clickable: true
        }, {
          id: 4,
          position: {
            left: _width - 10 - 45,
            top: 90,
            width: 45,
            height: 48,
          },
          iconPath: '../../images/map_mine@2x.png',
          clickable: true
        }
      ]
    })
    this.isFirstLoad = true;
    let self = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function (res) {
        self.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        wx.setStorageSync("lat", res.latitude);
        wx.setStorageSync("lon", res.longitude);
       // self.moveToLocation();
        self.getNearsData(res);
      },
      fail: function (res) {
      },
      complete: function (res) { },
    })
    utils.ajax({
      url: "/xcx/near/map/config",
      method: "get",
      success: function (res) {
        console.log('res',res);
        var data = res.data.data;
        var result = '10';
        if (data == '2') {
          result = '12'
        } else if (data == '3') {
          result = '14'
        }
        self.setData({
          scale: result,
        })
        console.log('scale', self.data.scale);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    this.mapCtx = wx.createMapContext('dynamicMap');
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
  controlTapEvent: function (e) {
    switch (e.controlId) {
      case 1:
        this.moveToLocation();
        break;
      case 2:
        // wx.navigateTo({
        //   url: 'dynamicEdit/dynamicEdit',
        // })
        //自定义弹窗显示
        this.setData({
          hidemodel: false
        })
        break;
      case 3:
      //跳转到附近分享
        wx.navigateTo({
          url:'dynamicList/dynamicList',
        })
        break;
      case 4:
      //跳转到我的分享
        wx.navigateTo({
          url:'dynamicMine/dynamicMine',
        })
        break;
      default: return;
    }
  },
  hideModel:function(){
    this.setData({
      hidemodel: true
    })
  },
  makerTapEvent: function (e) {
    console.log(e)
    wx.navigateTo({
      url:'dynamicDetail2/dynamicDetail2?tradeNo=' + e.markerId,
      //url: 'dynamicDetail2/dynamicDetail2?item=' + JSON.stringify(this.nearDatas[e.markerId]),
    })
  },
  updatedEvent: function (e) {

    if (this.isRegionchange) {
      this.isRegionchange = false;
      return
    }
    // let self = this;
    // wx.getLocation({
    //   type: 'gcj02',
    //   altitude: true,
    //   success: function (res) {
    //     self.setData({
    //       latitude: res.latitude,
    //       longitude: res.longitude
    //     })
    //     self.moveToLocation();
    //   },
    //   fail: function (res) { 
    //     self.setData({
    //       latitude: 31.254188,
    //       longitude: 121.397177
         
    //     })
    //     self.moveToLocation();
    //   },
    //   complete: function (res) { },
    // })
  },
  regionchangeEvent: function (e) {
    if (e.type == 'end' || this.isFirstLoad) {
      this.isRegionchange = true;
      this.isFirstLoad = false;
      this.getCenterLocation();
    }
  },
  getCenterLocation: function () {
    let self = this;
    this.mapCtx.getCenterLocation({
      success: function (res) {
        self.getNearsData(res);
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation();
  },
  getNearsData: function (local) {
    let _markers = this.data.markers;
    if (_markers.length > 0) {
      this.setData({
        markers: _markers
      })
      return
    }
    var self=this;
    utils.ajax({
      url: "/xcx/near/map/list",
      data: {
        lat: self.data.latitude,
        lng: self.data.longitude
      },
      method: "post",
      success: function (res) {
        console.log(res,'标点')
        if (res.statusCode == 200 && res.data.code == 1) {
          var _markers = [{ id: 0, latitude: self.data.latitude, longitude: self.data.longitude}];
          self.nearDatas = res.data.data.data;
          self.nearDatas.forEach((v, index) => {
            const item = {
              id:v.id,
              latitude: parseFloat(v.latitude) + Math.random()*0.0001,
              longitude: parseFloat(v.longitude) + Math.random() * 0.0001,
              iconPath: '../../images/map_mark@3x.png',
              width: 30,
              height: 30,
              callout: {
                content: v.title,
                color: '#f35b4a',
                bgColor: '#ffffff',
                fontSize: 14,
                textAlign: 'center',
                display: "ALWAYS",
                // x: 10,
                // y: -40,
                borderRadius: 5,
                // borderWidth: 1,
                // borderColor: '#f35b4a',
                padding: 2
              }
            }
            _markers.push(item);
          })
          self.setData({
            markers: _markers,
            isshow:true
          })
          console.log(_markers,'markers')
        } else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '网络错误',
          })
        }
      }
    })   
 
  },
  todynamicEdit:function(){
    //关闭自定义弹窗
    this.setData({
      hidemodel: true
    })  
    //跳转到发布图文页面
     wx.navigateTo({
          url:'dynamicEdit/dynamicEdit',
        })
  },
  todynamicEditVideo:function(){
    //关闭自定义弹窗
    this.setData({
      hidemodel: true
    })  
    //跳转到发布视频页面
    wx.navigateTo({
      url:'dynamicEditVideo/dynamicEditVideo'
    })
  },
      goto(e){
        var data = getCurrentPages();
        var d = 1;
        var url = e.currentTarget.dataset.url;
        for (var i = 0; i < data.length; i++) {
            if(data[i].route == url){
              console.log(i)
                wx.navigateBack({
                    delta:i
                })
                d = 2;
            }
        }
        if(d !== 2){
            wx.navigateTo({
            url:'/'+url
        })
        }
        

    }
})