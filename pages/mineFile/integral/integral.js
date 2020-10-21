var mineService = require('../../../common/newService/mineService');
let qbDate = require('../../../common/qbDate.js');
const app = getApp();
// wallet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPoints: 0,
    recordList: [],
    isShowApplicationView: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const res = wx.getSystemInfoSync();
    this.setData({
      scrollViewHeight: res.windowHeight - 150 - 45 - 49,
      width: res.windowWidth
    })
    this.getUserPoints();
    this.getSalesmanUserStatus();
    this.pageIndex = 1;
    this.getDetail(this.pageIndex);
  },

  applicationEvent: function () {
    wx.navigateTo({
      url: 'ambassador/ambassador',
    })
  },

  onShow: function (options) {

  },

  getUserPoints: function () {
    let self = this;
    mineService.getUserPoints(function (res) {
      if (res.statusCode == 200 && res.data.status == 1) {
        self.setData({
          userPoints: res.data.points,
          // isShowApplicationView: parseInt(5000) >= 2000 ? true : false
          isShowApplicationView: parseInt(res.data.points) >= 2000 ? true : false
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.msg ? res.data.msg : '网络出错',
        })
      }
    }, function (err) { })
  },
  getSalesmanUserStatus: function () {
    let self = this;
    mineService.getSalesmanUserStatus(function (res) {
      if (res.statusCode == 200 && res.data.status == 1) {
        self.setData({
          salesmanTitle: res.data.audit_status ? res.data.audit_status : '申请为健康大使',
        })
      }
    }, function (err) {
      console.log(err);
    })
  },
  getDetail: function (pageIndex) {
    const self = this;
    let data = {
      row: pageIndex
    }
    mineService.getUserPointLogList(data, function (res) {
      if (res.statusCode == 200 && res.data.status == 1) {
        if (res.data.points_log_list) {
          var _recordList = [];
          res.data.points_log_list.forEach(v => {
            let item = {
              index: v.id,
              time: qbDate.timeToDate(v.add_time * 1000).replace(/-/g, '/'),
              event: "",
              point: v.attribute == 1 ? ('+' + v.number) : (v.attribute == 2 ? ('-' + v.number) : '0'),
              detail: v.name
            }
            _recordList.push(item);
          })
          self.totalPageCount = res.data.count;
          self.setData({
            recordList: _recordList
          })
        } else {
          self.totalPageCount = res.data.count;
          wx.showToast({
            icon: 'none',
            title: '无数据',
          })
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.msg ? res.data.msg : '网络出错',
        })
      }
    }, function (err) {
      wx.showToast({
        icon: 'none',
        title: '网络出错',
      })
    })
  },
  pageEvent: function (e) {
    switch (e.currentTarget.dataset.type) {
      case "0":
        if (this.pageIndex == 1) {
          wx.showToast({
            icon: 'none',
            title: '已经是最头了',
          })
          return;
        }
        this.pageIndex = 1;
        break;
      case "1":
        this.pageIndex -= 1;
        if (this.pageIndex == 0) {
          this.pageIndex = 1;
          wx.showToast({
            icon: 'none',
            title: '已经是最头了',
          })
          return;
        }
        break;
      case "2":
        this.pageIndex += 1;
        if (this.pageIndex > this.totalPageCount) {
          this.pageIndex = this.totalPageCount;
          wx.showToast({
            icon: 'none',
            title: '已经是最底了',
          })
          return;
        }
        break;
      case "3":
        if (this.pageIndex == this.totalPageCount) {
          wx.showToast({
            icon: 'none',
            title: '已经是最底了',
          })
          return;
        }
        this.pageIndex = this.totalPageCount
        break;
      default: return;
    }
    this.getDetail(this.pageIndex);
  }
})