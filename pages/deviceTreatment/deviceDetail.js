// pages/deviceTreatment/deviceDetail.js
import mineService from '../../common/newService/mineService.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course_data:[],
    course_parameter:[]
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var id = options.id
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollViewHeight: res.windowHeight - 44,
        })
      },
    })
    mineService.getCourseParameter({ course_id: id},function(res) {
      if(res.data.status == 1) {
        self.setData({
          course_data: res.data.course_data,
          course_parameter: res.data.course_parameter
        })
      }else{
        wx.showToast({
          title: 'res.data.msg'
        })
        self.setData({
          course_data: [],
          course_parameter: []
        })
      }
    },function(err) {

    })
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