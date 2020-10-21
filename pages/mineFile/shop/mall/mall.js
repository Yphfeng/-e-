// mall.js

const app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tools: [{
      key: 0,
      text: "首页",
      isSelected: true,
    }, {
      key: 1,
      text: "购物车",
      isSelected: false
    }, {
      key: 2,
      text: "订单",
      isSelected: false
    }, 
    // {
    //   key: 3,
    //   text: "售后",
    //   isSelected: false
    // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.showPage){
      var data = this.data.tools;
      data.forEach(v => {
        if (v.key == options.showPage) {
          v.isSelected = true;
        }else{
          v.isSelected = false;
        }
      })
    }
    const tabBar = app.globalData.tabBar;
    console.log(tabBar)
    this.setData({
      tabBar: tabBar
    })
   
  },
  onShow: function() {
    
    var _tools = this.data.tools;
    var _key;
    _tools.forEach(v => {
      if (v.isSelected == true) {
        _key = v.key;
      }
    })
    this.setData({
      showPage: _key,
      tools: _tools
    })

  },

  onHide: function() {

  },

  onUnload: function () {
      
  },
  toolBarTapEvent: function (e) {
    this.setData({
      showPage: e.detail.message.key
    })
  }
})