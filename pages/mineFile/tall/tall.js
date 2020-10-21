// tall.js
var message = "";
// var handle = require('tallHandle');
var chatToUserId = "";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        templates: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var self = this;
        wx.getSystemInfo({
            success: function (res) {
                self.setData({
                    containerViewHeight: res.screenHeight - 64,
                    scrollViewHeight: res.screenHeight - 115,
                })
            },
        });

        // 初始化聊天记录
        chatToUserId = options.chatUserId;
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

        // var self = this;
        // // 初始化界面
        // handle.loadChatConten(self, chatToUserId);
        // // 定时获取聊天内容
        // handle.loadChatContentRegularly(self, chatToUserId);
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

        message = "";
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        console.log("页面下拉");
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log("页面上拉");
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * 输入框
     */
    inputAction: function (e) {
        message = e.detail.value
    },
    /**
     * 发送数据
     */
    sendMessageAction: function () {

        if (message == undefined || message == "") {
            return
        }
        var self = this;
        handle.sendMessage(message, self, chatToUserId);
        message = "";
    },
    upper: function (e) {
        console.log(e);
    },
    lower: function (e) {
        console.log(e);
    }
})