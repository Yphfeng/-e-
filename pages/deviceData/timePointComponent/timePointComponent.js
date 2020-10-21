// pages/deviceData/timePointComponent/timePointComponent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: {
      type: String,
      value: 400
    },
    height: {
      type: String,
      value: 100
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  attached: function () {
    
    const _points = [];
    for (var i = 0; i < 96; i++) {
      const num = i * 15;
      _points.push({
        index: i,
        value: parseInt(num / 60) + ":" + num % 60,
        selected: false
      })
    }
    this.setData({
      points: _points
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tapEvent: function (e) {

      const idx = e.currentTarget.dataset.index;
      const _points = this.data.points
      _points.forEach((v, index) => {
        if (index == idx) {
          v.selected = true
        } else {
          v.selected = false
        }
      })
      this.setData({
        points: _points
      })
      this.triggerEvent('tapTimePoint', { "timePoint": this.data.points[idx] });
    }
  }
})
