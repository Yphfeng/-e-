// pages/mineFile/integral/ambassador/ambassador.js

import miniService from '../../../../common/newService/mineService'
Page({

            /**
             * 页面的初始数据
             */
            data: {

            },

            /**
             * 生命周期函数--监听页面加载
             */
            onLoad: function(options) {
                let sys = wx.getSystemInfoSync();
                this.setData({
                    scrollHeight: sys.windowHeight - 170,
                    width: sys.windowWidth
                })
            },

            /**
             * 生命周期函数--监听页面初次渲染完成
             */
            onReady: function() {

            },

            /**
             * 生命周期函数--监听页面显示
             */
            onShow: function() {

            },

            /**
             * 生命周期函数--监听页面隐藏
             */
            onHide: function() {

            },

            /**
             * 生命周期函数--监听页面卸载
             */
            onUnload: function() {

            },

            /**
             * 页面相关事件处理函数--监听用户下拉动作
             */
            onPullDownRefresh: function() {

            },

            /**
             * 页面上拉触底事件的处理函数
             */
            onReachBottom: function() {

            },
            inputEvent: function(e) {
                switch (e.currentTarget.dataset.type) {
                    case 'name':
                        this.name = e.detail.value;
                        break;
                    case 'phoneNum':
                        this.phoneNum = e.detail.value;
                        break;
                    case 'idCard':
                        this.idCard = e.detail.value;
                        break;
                    case 'address':
                        this.address = e.detail.value;
                        break;
                    case 'weChatId':
                        this.weChartId = e.detail.value;
                        break;
                    case 'reward':
                        this.reward = e.detail.value;
                        break;
                    default:
                        return;
                }
            },
            applicationEvent: function(e) {
                switch (e.currentTarget.dataset.type) {
                    case 'sure':
                        miniService.applyHealthAmbassador(function(res) {
                                if (res.data.status == 1) {
                                    wx.showToast({
                                        title: '申请成功',
                                    })
                                    setTimeout(function() {
                                        wx.redirectTo({
                                            url: '../ambassadorOk/ambassadorOk'
                                        })
                                    }, 1000)
                                } else {
                                    wx.showToast({
                                        title: res.data.msg
                                    })
                                }
                            }, function(err) {
                                wx.showToast({
                                        title: err.data.msg
                                })
                              })
                            break;
                            default: return;
                        }
                }
            })