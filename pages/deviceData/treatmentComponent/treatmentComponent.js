// pages/deviceData/treatmentComponent/treatmentComponent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: String,
      value: 200
    },
    width: {
      type: String,
      value: 200
    },
    value: {
      type: String,
      value: 0
    },
    treatments: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // treatments: [
    //   { sn: 1, value: "手动", selected: false },
    //   { sn: 16, value: "净血疗程", selected: false },
    //   { sn: 32, value: "排毒疗程", selected: false },
    //   { sn: 48, value: "养颜疗程", selected: false },
    //   { sn: 64, value: "血压疗程一", selected: false },
    //   { sn: 65, value: "血压疗程二", selected: false },
    //   { sn: 66, value: "血压疗程三", selected: false },
    //   { sn: 67, value: "血压疗程四", selected: false },
    //   { sn: 80, value: "血糖疗程一", selected: false },
    //   { sn: 81, value: "血糖疗程二", selected: false },
    //   { sn: 82, value: "血糖疗程三", selected: false },
    //   { sn: 83, value: "血糖疗程四", selected: false },
    //   { sn: 96, value: "冠心病疗程", selected: false },
    //   { sn: 102, value: "脑梗塞疗程", selected: false },
    //   { sn: 118, value: "心肌梗疗程", selected: false },
    //   { sn: 124, value: "光子血糖", selected: false },
    // ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapEvent: function(e) {
      const _sn = e.currentTarget.dataset.sn;
      var _treatments = this.data.treatments;
      var _course; 
      _treatments.forEach(v=>{
        if (v.course_data.course_type_sn == _sn) {
          _course = v;
        }
      })
      this.triggerEvent("tapTreatment", {'treatment': _course}, {})
    }
  },
  attached: function () {
      // console.log(this.properties.treatments.length)
  }
})
