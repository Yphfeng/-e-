// components/columnCharts/columnCharts.js
let wxCharts = require('../../common/wxcharts.js');
var columnChart = null;
let app = getApp();
var chartData = {
  main: {
    title: '总成交量',
    data: [15, 20, 45, 37, 50, 15, 20, 45, 37, 50, 23, 22],
    categories: ['2012', '2013', '2014', '2015', '2016', '2012', '2013', '2014', '2015', '2016', '2012', '2013']
  },
  sub: []
};
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: {
      type: String,
      value: '300'
    },
    height: {
      type: String,
      value: '150'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  ready: function() {
    
    const columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: chartData.main.categories,
      series: [{
        name: '成交量',
        data: chartData.main.data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      yAxis: {
        format: function (val) {
          return val;
        },
        title: 'hello',
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
      width: this.properties.width,
      height: this.properties.height,
      enableScroll: true,
      enableVertical: true,
    });

  },

  // touchHandler: function (e) {
  //   columnChart.scrollStart(e);
  // },
  // moveHandler: function (e) {
  //   columnChart.scroll(e);
  // },
  // touchEndHandler: function (e) {
  //   columnChart.scrollEnd(e);
  //   columnChart.showToolTip(e, {
  //     format: function (item, category) {
  //       console.log(item, category);
  //       return category + ' ' + item.name + ':' + item.data
  //     }
  //   });
  // },
})
