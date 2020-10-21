let wxCharts = require('../../common/wxcharts.js');
let getDeviceDataHandle = require('getDeviceDataHandle.js');
let requestDataHandle = require('requestDataHandle.js');

var columnChartData = {
  main: {
    title: '总成交量',
    data: [15, 20, 45, 37],
    categories: ['2012', '2013', '2014', '2015']
  },
  sub: []
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: {},
    isShow: false,
    isShowHeartRateCustomView: false,
    isShowCourseListView: false,
    isShowUpdateDataView: false,
    beginDateSelected: true,
    hrMin: 0,
    hrMax: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.init();
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

  init: function () {

    this.showView();
    this.selectedKind("movement");
    const self = this;
    requestDataHandle.courseList(function (res) {
      if (res.statusCode == 200 && res.data.status == 1) {
        if (res.data.data && res.data.data.length > 0) {
          var _treatmentTitle;
          var _treatmentCode;
          var _treatmentParameter;
          res.data.data.forEach((v, index) => {
            if (index == 0) {
              v.selected = false;
              _treatmentTitle = v.course_data.course_name;
              _treatmentCode = v.course_data.course_type_sn;
              _treatmentParameter = v.course_parameter;
            } else {
              v.selected = false;
            }
          });
          self.setData({
            treatments: res.data.data,
            treatmentTitle: _treatmentTitle ? _treatmentTitle : '无疗程',
            treatmentCode: _treatmentCode,
            treatmentParameter: _treatmentParameter
          })
        }
      }
    }, function (err) {
      console.debug(err);
    });
  },

  showView: function () {

    let system = wx.getSystemInfoSync();
    this.height = system.windowHeight;
    this.width = system.windowWidth;
    this.rightViewWidth = 80 - 1;
    this.rightViewHeight = this.width - 60 - 1;// width - topviewHeight
    this.topViewWidth = this.height - 80;
    this.topViewHeight = 60;
    this.contentWidth = this.width - 60 - 1 - 30;
    this.contentHeight = this.height - 80;
    this.noticeHeight = 30;

    this.setData({
      rightViewWidth: this.rightViewWidth,
      rightViewHeight: this.rightViewHeight, // width - topviewHeight
      topViewWidth: this.topViewWidth,
      topViewHeight: this.topViewHeight,
      contentWidth: this.contentWidth,
      contentHeight: this.height - 80,
      noticeHeight: this.noticeHeight,
    })

    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    this.animation = animation;
    animation.width(this.width).height(this.height).rotateZ(90).step();
    this.setData({
      animationData: animation.export()
    })
    let y = this.height - (this.height + this.width) / 2;
    let x = (this.height + this.width) / 2 - this.width;
    animation.width(this.height).height(this.width).translate(x, y).scale(0, 0).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function (res) {
      this.setData({
        isShow: true
      })
    }.bind(this), 100)
    setTimeout(function (res) {
      animation.scale(1, 1).step({ timingFunction: 'ease-out', duration: 1000 });
      this.setData({
        animationData: animation.export(),
      })
    }.bind(this), 200)
  },

  selectedKind: function (kindString) {

    this.kind = kindString;
    var subKindString = "days"
    switch (kindString) {
      case "movement":
        this.setData({
          movementColor: "#f35b4a",
          laserColor: "black",
          heartRateColor: "black",
          contentViewName: kindString,
          isShowHeartRateCustomView: false
        })
        break;
      case "laser":
        this.setData({
          movementColor: "black",
          laserColor: "#f35b4a",
          heartRateColor: "black",
          contentViewName: kindString,
          isShowHeartRateCustomView: false
        })
        subKindString = "weeks"
        break;
      case "heartRate":
        this.setData({
          movementColor: "black",
          laserColor: "black",
          heartRateColor: "#f35b4a",
          contentViewName: kindString,
          isShowHeartRateCustomView: false
        });
        break;
      default:
        return;
    }
    this.selectedSubkind(subKindString);
  },

  selectedSubkind: function (subkindString) {
    if (subkindString != 'course') {
      this.subkind = subkindString
    }
    switch (subkindString) {
      case "days":
        this.setData({
          daysColor: "#f35b4a",
          weeksColor: "black",
          mounthsColor: "black",
          yearsColor: "black",
          customColor: "black",
          isShowHeartRateCustomView: false
        })
        break;
      case "weeks":
        this.setData({
          daysColor: "black",
          weeksColor: "#f35b4a",
          mounthsColor: "black",
          yearsColor: "black",
          customColor: "black",
          isShowHeartRateCustomView: false
        })
        break;
      case "mounths":
        this.setData({
          daysColor: "black",
          weeksColor: "black",
          mounthsColor: "#f35b4a",
          yearsColor: "black",
          customColor: "black",
          isShowHeartRateCustomView: false
        })
        break;
      case "years":
        this.setData({
          daysColor: "black",
          weeksColor: "black",
          mounthsColor: "black",
          yearsColor: "#f35b4a",
          customColor: "black",
          isShowHeartRateCustomView: false
        })
        break;
      case "heartRateCustom":
        this.setData({
          daysColor: "black",
          weeksColor: "black",
          mounthsColor: "black",
          customColor: "#f35b4a",
          isShowHeartRateCustomView: !this.data.isShowHeartRateCustomView,
          beginDate: "开始日期",
          endDate: "结束日期",
          timePoint: "时间点"
        })
        return;
      case "course":
        var ret = this.data.isShowCourseListView
        this.setData({
          isShowCourseListView: ret ? false : true,
          isShowNoticeView: false
        })
        return;
      default:
        break;
    }
    this.requestData(this.kind, this.subkind);
  },

  heartRateCustomEvent: function (e) {

    switch (e.currentTarget.dataset.type) {
      case 'sure':
        if (this.data.beginDate == "开始日期" || this.data.beginDate == "结束日期" || this.data.timePoint == "时间点") {
          return
        }
        this.setData({
          isShowHeartRateCustomView: false,
          isShowNoticeView: true,
        })
        this.requestData(this.kind, this.subkind);
        break;
      case 'cance':
        this.setData({
          isShowHeartRateCustomView: false,
          isShowNoticeView: true,
        })
        break;
      case 'endDate':
        this.setData({
          endDateSelected: true,
          beginDateSelected: false,
          timeSelected: false
        })
        break;
      case 'beginDate':
        this.setData({
          endDateSelected: false,
          beginDateSelected: true,
          timeSelected: false
        })
        break;
      case 'time':
        this.setData({
          endDateSelected: false,
          beginDateSelected: false,
          timeSelected: true
        })
        break;
      default: break;
    }
  },

  tapDayItem: function (e) {
    if (this.data.beginDateSelected) {
      const beginDate = e.detail.year + "-" + e.detail.month + "-" + e.detail.day;
      this.setData({
        beginDate: beginDate
      })
    } else if (this.data.endDateSelected) {
      const endDate = e.detail.year + "-" + e.detail.month + "-" + e.detail.day
      this.setData({
        endDate: endDate
      })
    }
  },

  timePointEvent: function (e) {

    this.setData({
      timePoint: e.detail.timePoint.value,
      timePointIndex: e.detail.timePoint.index
    })
  },

  tapTreatmentEvent: function (e) {
    this.setData({
      isShowCourseListView: false,
      treatmentCode: e.detail.treatment.course_data.course_type_sn,
      treatmentTitle: e.detail.treatment.course_data.course_name,
      treatmentParameter: e.detail.treatment.course_parameter
    })
    this.requestData(this.kind, this.subkind)
  },

  requestData: function (kind, subkind) {  
    const self = this;
    switch (kind) {
      case 'movement':
        requestDataHandle.movement(subkind, function (res) {
          switch (subkind) {
            case 'days':
              self.arcCanvas(res.total.steps);
              break;
            case 'weeks':
            case 'mounths':
            case 'years':
              self.columnChart(res);
              break;
            default: return;
          }
          self.setData({
            totalSteps: res.total.steps,
            totalDistance: res.total.distance,
            totalCalorie: res.total.calorie
          })
        },function(){})
        break;
      case 'laser':
        var _data;
        switch (subkind) {
          case 'weeks':
            _data = {
              type: 0,
              week_num: 1,
              course_sn: this.data.treatmentCode,
            }
            break;
          case 'mounths':
            _data = {
              type: 1,
              week_num: 0,
              course_sn: this.data.treatmentCode,
            }
            break;
          case 'years':
            _data = {
              type: 2,
              week_num: 0,
              course_sn: this.data.treatmentCode,
            }
            break;
          default:
            return;
        }
        requestDataHandle.laser(subkind, _data, this.data.treatmentParameter, function (res) {
          self.setData({
            laserTotalNum: res.totalNum,
            laserTotalDuration: res.totalDuration
          })
          self.lineChart(res);
        })
        break;
      case 'heartRate':
        var _data;
        switch (subkind) {
          case 'days':
            _data = {
              type: 0,
              day_num: 0
            }
            break;
          case 'weeks':
            _data = {
              type: 1,
              week_num: 1
            }
            break;
          case 'heartRateCustom':
            if (this.data.beginDate == '开始日期' || this.data.endDate == '结束日期' )
            {
              return
            }
            _data = {
              type: 2,
              time_start: this.data.beginDate,
              time_end: this.data.endDate,
              point: this.data.timePointIndex
            }
            // this.setData({
            //   hrCustomBeginTime: _time_start,
            //   hrCustomEndTime: _time_end,
            //   hrCustomPoint: _point
            // })
            break;
          default:
            return;
        }
        requestDataHandle.heartRate(subkind, _data, function (res) {
          self.setData({
            hrMin: res.min,
            hrMax: res.max
          })
          self.lineChart(res);
        })
        break;
      default:
        break;
    }
  },

  topViewEvent: function (e) {// 顶部视图事件处理
    let _subkind = e.currentTarget.dataset.subkind;
    if ((_subkind == 'course' || _subkind == "heartRateCustom") && this.data.isShowUpdateDataView == false) { // 如果是疗程、心率自定义 && 界面未打开的情况下
      this.selectedSubkind(_subkind);
      return;
    }
    if (this.subkind == _subkind) { // 去重
      return;
    } 
    if (this.data.isShowHeartRateCustomView || this.data.isShowCourseListView || this.data.isShowUpdateDataView) {
      return;
    }

    this.selectedSubkind(_subkind);
  },

  rightViewEvent: function (e) {// 右边视图事件处理

    if (this.data.isShowHeartRateCustomView || this.data.isShowCourseListView || this.data.isShowUpdateDataView) {
      return;
    }
    if (this.kind == e.currentTarget.dataset.kind) {
      return
    }
    this.kind = e.currentTarget.dataset.kind;
    this.selectedKind(this.kind);
  },

  updateDataEvent: function (e) {// 上传数据按钮
    var firmwareVersion = wx.getStorageSync('firmwareVersion') || '';

    if (this.data.isShowHeartRateCustomView || this.data.isShowCourseListView) {
      return;
    }
    const self = this;
    switch (e.currentTarget.dataset.type) { // 上传数据类型
      case 'movement':
      case 'laser':
      case 'heartRate':
      case 'allData':
        this.setData({
          updateDataType: e.currentTarget.dataset.type
        })
        getDeviceDataHandle.getDeviceData(self, e.currentTarget.dataset.type, function (res) {
       
          self.setData({
            updateStatus: '上传成功',
          });
          
        }, function (err) {
          self.setData({
            updateStatus: err.status,
          })
        });
        break;
      case 'showOrHidden':
        let _ret = !this.data.isShowUpdateDataView
        this.setData({
          updateStatus: '上传数据',
          isShowUpdateDataView: _ret
        });
        if (_ret == false) { // 如果隐藏则直接获取数据
          this.requestData(this.kind, this.subkind);
        }
        return;
      default:
        return;
    }
  },

  columnChart: function (columnChartData) {

    this.chartObject = new wxCharts({
      canvasId: 'contentCanvas',
      type: 'column',
      animation: false,
      categories: columnChartData.categories,
      series: [{
        name: '步',
        data: columnChartData.values,
        format: function (val, name) {
          return val;
        }
      }],
      yAxis: {
        format: function (val) {
          return val;
        },
        // title: 'hello',
        min: 0
      },
      xAxis: {
        disableGrid: true,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: this.contentHeight,
      height: this.contentWidth,
      enableScroll: true,
      enableVertical: true,
    });
  },

  lineChart: function (simulationData) {

    this.chartObject = new wxCharts({
      canvasId: 'contentCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: false,
      series: simulationData.values,
      xAxis: {
        disableGrid: false
      },
      yAxis: {
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      enableVertical: true,
      width: this.contentHeight,
      height: this.contentWidth,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  arcCanvas: function (steps) {

    const width = this.contentWidth;
    const height = this.contentHeight;
    const r = 100;
    const ctx = wx.createCanvasContext("contentCanvas");
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(0.5 * Math.PI);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.closePath();
    ctx.beginPath();
    ctx.translate(-width / 2, -width / 2);
    // const grd = ctx.createLinearGradient(0, 0, 3 * r, 0)
    // grd.addColorStop(0, '#f35b4a');
    // grd.addColorStop(1, 'black');
    // ctx.setFillStyle(grd);
    ctx.setFillStyle("#7cb5ec");
    ctx.fillRect(0, 0, width, width);
    ctx.closePath();
    ctx.beginPath();
    ctx.translate(width / 2, width / 2);
    ctx.arc(0, 0, r - 10, 0, 2 * Math.PI);
    ctx.setFillStyle("white");
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.setFontSize(18);
    ctx.setTextAlign('center');
    ctx.setTextBaseline('middle');
    ctx.setFillStyle('black');
    ctx.fillText('今日行走', 0, -35)
    ctx.setFontSize(35);
    ctx.fillText(steps, 0, 10)
    ctx.closePath();
    ctx.restore();
    ctx.draw();
  },

  // canvas enent
  touchHandler: function (e) {
    if (this.chartObject) {
      this.chartObject.scrollStart(e);
    }
  },
  moveHandler: function (e) {
    if (this.chartObject) {
      this.chartObject.scroll(e);
    }
  },
  touchEndHandler: function (e) {
    if (this.chartObject) {
      this.chartObject.scrollEnd(e);
    }
    // lineChart.showToolTip(e, {
    //   format: function (item, category) {
    //     return category + ' ' + item.name + ':' + item.data
    //   }
    // });
  },
})


