// pages/boolSugaData/boolSugaData.js
var wxCharts = require('../../common/wxcharts.js');
var qbDate = require('../../common/qbDate.js');
var bloodSugarService = require('../../common/newService/boolSugarService.js');
var app = getApp();
var lineChart = null;
var timePeriodName;
var bloodType = null;
var currentIndex = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    todayDate: "",
    tableData: [],
    isShow: true
  },

  touchHandler: function (e) {
    // console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

  btnTapEvent: function (e) {
    const tag = e.currentTarget.dataset.tag;
    switch (tag) {
      case "1":
        currentIndex += 1;
        break;
      case "2":
        currentIndex -= 1;
        break;
      case "3":
        wx.navigateTo({
          url: '../boolSugaChooseType/boolSugaChooseType',
        })
        return;
      default:
        break;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
      wx.showToast({
        title: '已是最新数据',
      })
      return;
    } else {
      this.getBloodSugarData(currentIndex, bloodType);
    }
  },

  itemAddEvent: function (e) {
    wx.navigateTo({
      url: '../boolSugaDynamicd/boolSugaDynamicd?message=' + e.currentTarget.dataset.item + "_" + String(bloodType),
    })
  },

  getBloodSugarData: function (num, bloodType) {

    const that = this;
    // 获取数据
    bloodSugarService.getBloodSugarData({
      num: num,
      type: bloodType
    }, function (res) {
      that.dataHandle(res, num);
    }, function (err) {
      console.log(err);
    })
  },

  dataHandle: function (res, num) {

    const tableData = [];
    const timePeriod1Array = [];
    const timePeriod2Array = [];
    const timePeriod3Array = [];
    const categories = [];

    if (res.data.user_data == null || res.data.user_data.length == 0) {

      for (var i = 0; i < 7; i++) {
        const nd = qbDate.getNewDay(-(num * 7 + i));
        categories.push(nd);
        timePeriod1Array.push(0);
        timePeriod2Array.push(0);
        timePeriod3Array.push(0);
        const item = {
          dataKey: i,
          date: nd,
          timePeriod_1: "+",
          timePeriod_2: "+",
          timePeriod_3: "+"
        }
        tableData.push(item);
      }
    } else {

      const data = res.data.user_data;
      for (var i = 0; i < 7; i++) {

        const nd = qbDate.getNewDay(-(num * 7 + i));
        var item = new Object();
        var ret = false;

        data.forEach((v, index) => {

          const dateString = v.y + "-" + (v.m.length == 1 ? "0" + v.m : v.m) + "-" + (v.d.length == 1 ? "0" + v.d : v.d);

          if (dateString == nd) {
            ret = true
            const timePeriod_1 = v.before_breakfast == null ? 0 : v.before_breakfast;
            const timePeriod_2 = v.after_breakfast == null ? 0 : v.after_breakfast;
            const timePeriod_3 = v.after_smear == null ? 0 : v.after_smear;
            timePeriod1Array.push(timePeriod_1);
            timePeriod2Array.push(timePeriod_2);
            timePeriod3Array.push(timePeriod_3);
            item.dataKey = i;
            item.date = nd;
            item.timePeriod_1 = timePeriod_1 == 0 ? "+" : timePeriod_1
            item.timePeriod_2 = timePeriod_2 == 0 ? "+" : timePeriod_2;
            item.timePeriod_3 = timePeriod_3 == 0 ? "+" : timePeriod_3;
          }
        });
        if (ret == false) {// 不存在相同的日期
          timePeriod1Array.push(0);
          timePeriod2Array.push(0);
          timePeriod3Array.push(0);
          item.dataKey = i;
          item.date = nd;
          item.timePeriod_1 = "+";
          item.timePeriod_2 = "+";
          item.timePeriod_3 = "+";
        }
        categories.push(nd);
        tableData.push(item);
      }
    }
    this.updateUI({
      tableData: tableData,
      categories: categories,
      timePeriod_1: timePeriod1Array,
      timePeriod_2: timePeriod2Array,
      timePeriod_3: timePeriod3Array,
    })

  },
  updateUI: function (simulationData) {

    // 展示数据
    // 1:表格数据
    this.setData({
      tableData: simulationData.tableData,
      currentDate: simulationData.categories[0]
    })
    // 2: 折线图数据
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories.reverse(),
      animation: true,
      series: [{
        name: timePeriodName.data[0],
        data: simulationData.timePeriod_1.reverse(),
        format: function (val, name) {
          val = parseFloat(val);
          return val.toFixed(1);
        }
      }, {
        name: timePeriodName.data[1],
        data: simulationData.timePeriod_2.reverse(),
        format: function (val, name) {
          val = parseFloat(val);
          return val.toFixed(1);
        }
      }, {
        name: timePeriodName.data[2],
        data: simulationData.timePeriod_3.reverse(),
        format: function (val, name) {
          val = parseFloat(val);
          return val.toFixed(1);
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        // title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(0);
        },
        min: 0
      },
      width: app.screenWidth,
      height: 220,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // 判断用户是否选择了类型，如果没有获取类型
    timePeriodName = app.getBoolSugarTimePeriodNames();
    bloodType = 1;  
    if (timePeriodName.name == "外涂") {
      bloodType = 2;
    }
    this.setData({
      bloodTypeName: timePeriodName.name,
      timePeriod_1_name: timePeriodName.data[0],
      timePeriod_2_name: timePeriodName.data[1],
      timePeriod_3_name: timePeriodName.data[2]
    })
    // 获取数据
    currentIndex = 0
    this.getBloodSugarData(currentIndex, bloodType);
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

  }
})