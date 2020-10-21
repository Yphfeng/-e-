// pages/merchants/add/add.js
import getAjax from '../../../common/getAjax.js';
import getCitys from '../../../common/newService/getCitys.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync("user").token;
    this.setData({
      token: token
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
    var self = this;
    self.getProvices();
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
  bindChange: function(e) {
    var self = this;
    var val = e.detail.value
    var t = this.data.values;
    console.log(val);
    console.log(t);
    var cityData = this.data.cityData;
    if (val[0] != t[0]) {
      //省的改变
      var index = val[0];
      console.log(self.data.provinces[index].code);
      var code = self.data.provinces[index].code;
      self.getCitys(code);
      self.setData({
        values: val,
        value:[val[0],0,0],
        province: self.data.provinces[index]
      })
    }
    if (val[1] != t[1]) {
      //市的改变
      var index = val[1];
      var code = self.data.citys[index].code;
      self.getCountrys(code)
      self.setData({
        values: val,
        value: [val[0], val[1], 0],
        city: self.data.citys[index]
      })
    }
    if(val[2] !== t[2]){
      var index = val[2];
      self.setData({
        values: val,
        county: self.data.countys[index]
      })
    }
  },
  getProvices: function () {
    var self = this;
    var data1 = { type: 2 }
    var data2 = { type: 3 }
    getCitys.getCitys({ type: 1 }, function (res) {
      if (res.data.status == 1) {
        self.setData({
          provinces: res.data.area_data,
          province: res.data.area_data[0]
        })
        data1.code = res.data.area_data[0].code;
        getCitys.getCitys(data1, function (res1) {
          console.log(res1);
          self.setData({
            citys: res1.data.area_data,
            city: res1.data.area_data[0]
          })
          data2.code = res1.data.area_data[0].code;
          getCitys.getCitys(data2, function (res2) {
            self.setData({
              countys: res2.data.area_data,
              county: res2.data.area_data[0]
            })
          })
        })
      }else{
        return;
      }
    }, function (err) {
      console.log(err)
    })
  },
  getCitys: function (code) {
    var self = this;
    var data1 = { type: 2 }
    var data2 = { type: 3 }
    data1.code = code;
    getCitys.getCitys(data1, function (res1) {
      if(res1.data.status == 1){
      self.setData({
        citys: res1.data.area_data,
        city: res1.data.area_data[0]
      })
      data2.code = res1.data.area_data[0].code;
      getCitys.getCitys(data2, function (res2) {
        self.setData({
          countys: res2.data.area_data,
          county: res2.data.area_data[0]
        })
      }, function (err2) {

      })
      }else{
        return;
      }
    })
  },
  getCountrys: function (code) {
    var self = this;
    var data2 = { type: 3 }
    data2.code = code;
    getCitys.getCitys(data2, function (res2) {
      if(res2.data.status == 1){
      self.setData({
        countys: res2.data.area_data,
        county: res2.data.area_data[0]
      }, function (err2) {

      })
      }else{
        return;
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var myreg = /^1[34578]\d{9}$/;
    if (!e.detail.value.name) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (!e.detail.value.mobile_no) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (!myreg.test(e.detail.value.mobile_no)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 2000
      })
    } else if (!e.detail.value.address){
      wx.showToast({
        title: '地址不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      getAjax.getPost('/Weixin/DealerStore/addStore', e.detail.value)
        .then((res) => {
          if (res.data.status == 1) {
            wx.showToast({
              title: '添加成功'
            })
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/channelProvider/list/list'
              })
            }, 1500)
          } else {
            wx.showToast({
              title: '添加失败'
            })
          }
        })
        .catch((err) => {
          wx.showToast({
            title: '添加失败'
          })
        })

    }
  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
})