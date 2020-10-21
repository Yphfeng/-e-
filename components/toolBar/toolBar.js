// components/toolBar/toolBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tools: {
      type: Array,
      value: []
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
    bindtapEvent: function (e) {
      let key = e.currentTarget.dataset.key;
      var _tools = this.properties.tools;
      _tools.forEach((v) => {
        if (key == v.key) {
          v.isSelected = true;
        } else {
          v.isSelected = false;
        }
      });
      this.properties.tools = _tools;
      this.setData({
        tools: _tools
      })
      this.triggerEvent('tapEvent', { 'message': this.properties.tools[key] }, {})
    }
  }
})
