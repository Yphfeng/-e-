// pages/mineFile/shop/returnGoods/returnGoods.js
import mineService from '../../../../common/newService/mineService.js'
import mallService from '../../../../common/newService/mallService.js'
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        num: 1,
        totalPrice: '',
        isDisabled: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const id = options.id;
        const windowInfo = wx.getSystemInfoSync();
        this.setData({
            urlPrefix: app.urlPrefix,
            _height: windowInfo.windowHeight - 125,
            __height: windowInfo.windowHeight - 210,
            id: id
        })
        this.returnGoodsInfo({ id: id });
        var index = options.index;
        if (index == "1") {
            wx.setNavigationBarTitle({
                title: '退货'
            })
            this.setData({
                title: '退货'
            })
        } else {
            wx.setNavigationBarTitle({
                title: '换货'
            })
            this.setData({
                title: '换货'
            })
        }
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    //获取退货信息
    returnGoodsInfo(data) {
        const self = this;
        mineService.returnGoodsInfo(data, function(res) {
            if (res.data.status == 1) {
                self.setData({
                    goods_list: res.data.goods_list,
                    totalPrice: res.data.goods_list[0].goods_price,
                    num: 1
                })
            }
        }, function(err) {
            console.log(err)
        })
    },
    add: function() {
        var num = this.data.num;
        var numTest = this.data.goods_list[0].return_goods_num;
        if (num < numTest) {
            num++;
            this.setData({
                num: num
            })
        } else {
            wx.showToast({
                title: '已超过最大可选数量',
                icon: 'none'
            })
        }
    },
    del: function() {
        var num = this.data.num
        if (num == 1) {
            wx.showToast({
                title: '数量不可小于1',
                icon: 'none'
            })
        } else {
            num--;
            this.setData({
                num: num
            })
        }
    },
    bindinput: function(e) {
        var val = e.detail.value;
        if (val > this.data.goods_list[0].return_goods_num) {
            val = this.data.goods_list[0].return_goods_num
            this.setData({
                num: val
            })
        } else if (val == 0) {
            this.setData({
                num: 1
            })
        }

    },
    //退(换)商品
    applicationForReturn: function() {
        const self = this;
        wx.showModal({
            title: '提示',
            content: '您确定退货吗？',
            success: function(res) {
                if (res.confirm) {
                    mallService.applicationForReturn({ return_num: self.data.num, id: self.data.id }, function(res) {
                        if (res.data.status == 1) {
                            wx.showToast({
                                title: '申请成功',
                                icon: 'none'
                            })
                            self.setData({
                                isDisabled: true
                            })
                            setTimeout(function() {
                                wx.navigateBack({
                                    delta: 2
                                })
                            }, 1000)
                        }
                    }, function(err) {

                    })
                } else if (res.cancel) {

                }
            }
        })
    }
})