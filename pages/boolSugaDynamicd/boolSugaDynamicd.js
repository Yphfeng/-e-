// pages/boolSugaDynamicd/boolSugaDynamicd.js
const bloodSugarService = require('../../common/newService/boolSugarService.js');
var qbDate = require('../../common/qbDate.js');
var that = null;
var app = getApp();
var deltaX = 0;
var minValue = 0;

var date;
var index;
var bloodType;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canvasHeight: 80,
    value: 0,
    isShowDateView: false,
    isShowTimePeriodView: false,
  },
  drawRuler: function () {

    var origion = { x: app.screenWidth / 2, y: that.data.canvasHeight };
    var end = { x: app.screenWidth / 2, y: that.data.canvasHeight };

    var heightDecimal = 50;
    var heightDigit = 25;

    var fontSize = 20;

    var maxValue = 250;

    var currentValue = 20;

    var ratio = 10;

    var canvasWidth = maxValue * ratio + app.screenWidth - minValue * ratio;

    that.setData({
      canvasWidth: canvasWidth,
      scrollLeft: (currentValue - minValue) * ratio
    });
    /* 2.绘制 */

    const context = wx.createCanvasContext('canvas-ruler');

    for (var i = 0; i <= maxValue; i++) {
      context.beginPath();

      context.moveTo(origion.x + (i - minValue) * ratio, origion.y);

      context.lineTo(origion.x + (i - minValue) * ratio, origion.y - (i % ratio == 0 ? heightDecimal : heightDigit));

      context.setLineWidth(2);

      context.setStrokeStyle(i % ratio == 0 ? 'gray' : 'darkgray');

      context.stroke();

      context.setFillStyle('gray');
      if (i % ratio == 0) {
        context.setFontSize(fontSize);

        context.fillText(i < 10 ? i : i / 10, origion.x + (i - minValue) * ratio, fontSize);
      }
      context.closePath();
    }

    context.draw();
  },
  drawCursor: function () {

    var center = { x: app.screenWidth / 2, y: 5 };

    var length = 20;

    var left = { x: center.x - length / 2, y: center.y + length / 2 * Math.sqrt(3) };

    var right = { x: center.x + length / 2, y: center.y + length / 2 * Math.sqrt(3) };

    const context = wx.createCanvasContext('canvas-cursor');
    context.moveTo(center.x, center.y);
    context.lineTo(left.x, left.y);
    context.lineTo(right.x, right.y);
    context.setFillStyle('#f35b4a');
    context.fill();
    context.draw();
  },

  bindscroll: function (e) {

    // deltaX 水平位置偏移位，每次滑动一次触发一次，所以需要记录从第一次触发滑动起，一共滑动了多少距离
    deltaX += e.detail.deltaX;
    // 数据绑定
    that.setData({
      value: (Math.floor(- deltaX / 10 + minValue) / 10).toFixed(1)
    });
  },

  submintBTNEvent: function () {
    const time = parseInt(qbDate.dateStringToTime(date[0] + "-" + date[1] + "-" + date[2]) / 1000);
    const item = {
      type: bloodType,
      time: time
    }
    switch (index) {
      case "0":
        item.before_breakfast = that.data.value;
        break;
      case "1":
        item.after_breakfast = that.data.value;
        break;
      case "2":
        item.after_smear = that.data.value;
        break;
      default:
        break;
    }
    bloodSugarService.updateBloodSugarData(item, function (res) {
      if(res.data.status == 1) {
        wx.showToast({
          title: '保存成功',
        })
      } else {
        wx.showToast({
          title: '保存失败',
        })
      }
    }, function (err) {
      wx.showToast({
        title: '网络出错',
      })
      console.log(err);
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const timePeriodNameObject = app.getBoolSugarTimePeriodNames();
    // 日期/类型值/类型数字/药类型
    const arr = options.message.split('_');
    date = arr[0].split("-");
    index = arr[1];
    bloodType = arr[2];

    this.setData({
      year: date[0],
      month: date[1],
      day: date[2],
      timePeriodName: timePeriodNameObject.data[index]
    })

    that = this;
    // 绘制标尺
    that.drawRuler();
    // 绘制三角形游标
    that.drawCursor();
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
    deltaX = 0
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

  }
})