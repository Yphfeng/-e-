// myTreatment.js
var handle = require('deviceTreatmentHandle');
import mineService from '../../common/newService/mineService.js'
let app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    topToolBarItems: [{
      key: 0,
      isSelected: true,
      title: '治疗仪疗程'
    }, {
      key: 1,
      isSelected: false,
      title: '已购买疗程'
    },{
      key: 2,
      isSelected: false,
      title: '疗程说明'
    }],
    pageStatus: 0,
    coursesOfBuy: [],
    courseInfoList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollViewHeight: res.windowHeight - 44,
          isConnectDevice: app.getDeviceInfo().isConnect
        })
      },
    })

    this.onBLE();
    mineService.getCourseInfoList(function(res) {
      // if(res.data.status == 1) {
        self.setData({
          courseInfoList: res.data.course_data
        })
      // }else{
      //   self.setData({
      //     courseInfoList: []
      //   })
      // }

    },function(err) {

    })
  },

  onShow: function () {

    var self = this;
    handle.initUserDeviceCourse(self);
    handle.initUserBuyCourse(self);
  },

  onUnload: function () {

    handle.clean();
  },

  topViewTapEvnet: function (e) {

    const key = e.currentTarget.dataset.key;
    var _toolBarItems = this.data.topToolBarItems;
    _toolBarItems.forEach(v => {
      if (v.key == key) {
        v.isSelected = true;
      } else {
        v.isSelected = false;
      }
    })
    this.setData({
      topToolBarItems: _toolBarItems,
      pageStatus: key
    })
  },
  /**
   * 激活疗程
   */
  courseEvent: function (e) {
    var self = this;
    let events = e.currentTarget.dataset.event.split('_');
    let _index = events[1];
    switch (events[0]) {
      case 'active': 
        handle.activeCourse(_index, self);
        break;
      case 'switch': 
        handle.switchCourse(_index);
        break;
      case 'update': 
        handle.updateCourseToBLE(_index);
        break;
      case 'binding': 
        handle.bindingDevice(_index);
        break;
      default:
        break;
    }
  },

  onBLE: function () {

    var self = this;
    handle.onBLE(self);
  },

  helpImageEvent: function (e) {

    const index = e.currentTarget.dataset.helpImage;
    handle.showHelp(index);
  },
  itemContentViewEvent: function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './deviceDetail?id='+id,
    })
  }
})