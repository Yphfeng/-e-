let businessService = require('../../../../common/newService/businessService.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        deviceList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let sys = wx.getSystemInfoSync();
        this.setData({
            scrollHeight: sys.windowHeight - 60 - 49 - 30 - 15,
            width: sys.windowWidth
        })
        this.getDeviceList(1);
        this.pageIndex = 1;
    },

    getDeviceList(pageIndex) {
        let self = this;
        businessService.getWholesalerDevice({ row: pageIndex }, function(res) {
            self.totalPageCount = res.data.count ? res.data.count : 1
            if (res.statusCode == 200 && res.data.status == 1) {
                self.setData({
                    deviceList: res.data.device_list,
                })
            } else {
                wx.showToast({
                    icon: 'none',
                    title: res.data.msg ? res.data.msg : '网络出错',
                })
            }
        }, function(err) {
            wx.showToast({
                icon: 'none',
                title: '网络出错',
            })
        })
    },

    pageEvent: function(e) {
        switch (e.currentTarget.dataset.type) {
            case "0":
                if (this.pageIndex == 1) {
                    wx.showToast({
                        icon: 'none',
                        title: '已经是最头了',
                    })
                    return;
                }
                this.pageIndex = 1;
                break;
            case "1":
                this.pageIndex -= 1;
                if (this.pageIndex == 0) {
                    this.pageIndex = 1;
                    wx.showToast({
                        icon: 'none',
                        title: '已经是最头了',
                    })
                    return;
                }
                break;
            case "2":
                this.pageIndex += 1;
                if (this.pageIndex > this.totalPageCount) {
                    this.pageIndex = this.totalPageCount;
                    wx.showToast({
                        icon: 'none',
                        title: '已经是最底了',
                    })
                    return;
                }
                break;
            case "3":
                if (this.pageIndex == this.totalPageCount) {
                    wx.showToast({
                        icon: 'none',
                        title: '已经是最底了',
                    })
                    return;
                }
                this.pageIndex = this.totalPageCount
                break;
            default:
                return;
        }
        this.getDeviceList(this.pageIndex);
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

    callPhoneEvent: function(e) {
        if (e.currentTarget.dataset.phoneNum !== '未绑定') {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phoneNum + '',
                success: function(res) {
                    // console.log(res);
                },
                fail: function(res) {
                    // console.log(res)
                },
                complete: function(res) {},
            })
        }

    },
    sortEvent: function(e) {

        switch (e.currentTarget.dataset.type) {
            case 'ECoin':
                this.setData({
                    isSortECoin: !this.data.isSortECoin
                })
                return;
            case 'days':
                this.setData({
                    isSortDays: !this.data.isSortDays
                })
                return;
            default:
                return;
        }
    }
})