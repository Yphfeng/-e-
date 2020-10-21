// pages/mineFile/shop/paymentStatus/paymentStatus.js
let mallApi = require('../../../../common/newService/mallService.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '支付成功'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        if (options.status == 1) {
            this.setData({
                title: "支付成功"
            })
        } else if (options.status == 0) {
            this.setData({
                title: "支付失败"
            })
        }
        this.setData({
            index: options.index
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

    statusEvent: function(e) {
        switch (e.currentTarget.dataset.type) {
            case 'courses':
                break;
            case 'order':
                break;
            default:
                break;
        }
    },
    confirm: function() {
        if (this.data.index == 1) {
            wx.redirectTo({
                url: '../componentOrder/shopOrder?key=1'
            })
        } else {
            wx.redirectTo({
                url: '../componentOrder/shopOrder?key=3'
            })
        }

    }
})