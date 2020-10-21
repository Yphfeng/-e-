// pages/devicePoint/devicePoint.js
const qbBLEManager = require('../../bluetooth/manager.js');
const api = require('../../bluetooth/api.js');
const ctx = wx.createCanvasContext("clock", this);
const width = 240;
const height = 240;
const r = width / 2;
const rem = width / 200;
const hours = [];
const minutes = [];
for (let i = 1; i <= 12; i++) {
  hours.push(i);
}
for (let i = 1; i <= 60; i++) {
  minutes.push(i);
}
const date = new Date();
const hour = date.getHours();
const minute = date.getMinutes();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: height,
    width: width,
    hours: hours,
    hour: hour,
    minutes: minutes,
    minute: minute,
    value: [hour - 1, minute - 1],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.draw(this.data.hour, this.data.minute);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  bindChange: function (e) {

    const val = e.detail.value;
    this.setData({
      hour: this.data.hours[val[0]],
      minute: this.data.minutes[val[1]]
    });
    this.draw(this.data.hours[val[0]], this.data.minutes[val[1]]);
  },

  buttonEvent: function (e) {
    const self = this;
    switch (e.currentTarget.dataset.type) {
      case "sure":
        wx.showModal({
          title: '当前表盘上的时间',
          content: '时针：' + this.data.hour + "，分针：" + this.data.minute,
          confirmText: "同步",
          success: function(e) {
            if (e.confirm) {
              qbBLEManager.setPointer({
                type: "1",
                hour: self.data.hour,
                minute: self.data.minute
              });
            }
          }
        })
        break;
      case "fine_tuning":
        const app = getApp();
        const deviceInfo = app.getDeviceInfo();
        if (deviceInfo.device.name == undefined) {
          wx.showToast({
            icon: 'none',
            title: '设备不符合',
          });
        }
        if (deviceInfo.device.name.indexOf("HA05") == 0) {
          qbBLEManager.setPointer({ 
            type: "0",
            value: 60
          });
          wx.showToast({ title: '设置成功', });
        } else if (deviceInfo.device.name.indexOf("HA06") == 0){
          qbBLEManager.setPointer({ 
            type: "0",
            value: 1
          });
          wx.showToast({ title: '设置成功', });
        } else {
          wx.showToast({ 
            icon: 'none',
            title: '设备不符合',
          });
        }
        break;
      default:
        break;
    }

  },

  drawCanvasBackground: function () {

    ctx.save();
    ctx.translate(r, r); 
    ctx.beginPath();
    ctx.setLineWidth(10 * rem)
    ctx.setStrokeStyle('black');
    ctx.arc(0, 0, r - 10 * rem / 2, 0, 2 * Math.PI, false);
    ctx.stroke();

    const hourNumber = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
    ctx.setFontSize(18 * rem);
    ctx.setTextAlign("center");
    ctx.setTextBaseline("middle");
    hourNumber.forEach((item, index) => {
      const rad = 2 * Math.PI / 12 * index; 
      const x = Math.cos(rad) * (r - 30 * rem);
      const y = Math.sin(rad) * (r - 30 * rem);
      ctx.fillText(item, x, y);
    })

    for (var i = 0; i < 60; i++) {
      const rad = 2 * Math.PI / 60 * i; 
      const x = Math.cos(rad) * (r - 17 * rem);
      const y = Math.sin(rad) * (r - 17 * rem);
      ctx.beginPath();
      if (i % 5 == 0) {
        ctx.setFillStyle('black');
        ctx.arc(x, y, 2 * rem, 0, 2 * Math.PI, false);
      } else {
        ctx.setFillStyle('gray');
        ctx.arc(x, y, 2 * rem, 0, 2 * Math.PI, false);
      }
      ctx.fill();
    }
  },

  drawHour: function (hour, minute) {

    ctx.save();
    ctx.beginPath();
    const rad = 2 * Math.PI / 12 * hour;
    const mrad = 2 * Math.PI / 12 / 60 * minute;
    ctx.rotate(rad + mrad);
    ctx.setStrokeStyle('black');
    ctx.setLineWidth(6 * rem);
    ctx.setLineCap("round");
    ctx.moveTo(0, 10 * rem);
    ctx.lineTo(0, -r / 2);
    ctx.stroke();
    ctx.restore();
  },

  drawMinute: function (minute) {

    ctx.save();
    ctx.beginPath();
    const rad = 2 * Math.PI / 60 * minute;
    ctx.rotate(rad);
    ctx.setStrokeStyle('black');
    ctx.setLineWidth(3 * rem);
    ctx.setLineCap("round");
    ctx.moveTo(0, 10 * rem);
    ctx.lineTo(0, -r + 30 * rem);
    ctx.stroke();
    ctx.restore();
  },

  drawSecond: function (second) {

    ctx.save();
    ctx.beginPath();
    ctx.setFillStyle('#f35b4a');
    const rad = 2 * Math.PI / 60 * second;
    ctx.rotate(rad);
    ctx.moveTo(-2, 20 * rem);
    ctx.lineTo(2, 20 * rem);
    ctx.lineTo(1, -r + 18 * rem);
    ctx.lineTo(-1, -r + 18 * rem);
    ctx.fill();
    ctx.restore();
  },

  drawDot: function () {

    ctx.beginPath();
    ctx.setFillStyle('#09bb0c');
    ctx.arc(0, 0, 3 * rem, 0, 2 * Math.PI, false);
    ctx.fill();
  },

  draw: function (hour, minute) {

    ctx.clearRect(0, 0, width, height);
  
    this.drawCanvasBackground();
    this.drawHour(hour, minute);
    this.drawMinute(minute);

    this.drawDot();
    ctx.draw();
    ctx.restore();
  }
})