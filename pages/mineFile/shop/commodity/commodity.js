// commodity.js
var mallApi = require('../../../../common/newService/mallService');
var mallBanner = require('../componentHome/mallBanner');
var commodity = new Object();
var swiperImageUrlArray = new Array();
var currentStatu;
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: '',
        showModalStatus: false,
        index: 0,
        animationData: {},
        lightColor: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        var self = this;
        var commodityId = options.commodityId;

        this.setData({
            url: app.urlWWW,
            commodityId: commodityId
        })
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    scrollviewHeight: res.screenHeight - 64 - 49
                })
            },
        })
        this.initCommodity(this.data.commodityId);
    },
    onShow: function(){
    },
    onShareAppMessage(res){
        return {
      title: '商城详情',
      path: '/pages/home/home?pageId='+ this.data.commodityId
    }

    },
    /** 初始化界面 */
    initCommodity(commodityId) {

        const self = this;
        mallApi.getGoodsDetail(commodityId, function(res) {

            if (res.data.status == 1) {
                commodity = res.data.goods_data;
                var prodctImageUrlObejcts = new Array();
                var swiperImageUrls = commodity.goods_head_img ? JSON.parse(commodity.goods_head_img) : [];
                console.log(typeof swiperImageUrls)
                self.setData({
                    goods_img: commodity.goods_img,
                    goods_name: commodity.goods_name,
                    goods_price: commodity.goods_price,
                    goods_num: commodity.goods_num,
                    prodctImageUrls: prodctImageUrlObejcts,
                    isTreament: commodity.goods_type + "" == "0" ? true : false,
                    title: commodity.goods_name,
                    money: commodity.goods_price,
                    usePoint: commodity.point == "0" ? false : true,
                    pointsNum: commodity.point == null ? 0 : commodity.point,
                    rulesContent: commodity.goods_describe,
                    detailContent: commodity.goods_content_img ? JSON.parse(commodity.goods_content_img) : [],
                    imageUrls: swiperImageUrls
                })
                if (commodity.goods_spec == "1") {
                    commodity.spec_data.forEach((v, index) => {
                        v.selectedColor = 'black';
                        v.key = index;
                    })
                    self.setData({
                        specs: commodity.spec_data,
                        isShowBuyNumView: true,
                        buyNum: 1,
                    })

                } else {
                    self.setData({
                        specs: [],
                        isShowBuyNumView: false,
                        buyNum: 1
                    })
                }
            } else {
                console.log('请求失败或者返回的数据为空');
            }
        }, function(err) {
            console.log(err);
        });
    },
    goChats(e) {
        wx.navigateTo({
            url: "/pages/mineFile/shop/shoppingCar/shoppingCar"
        })
    },
    toolBarAction: function(e) {
        var _this = this;
        var type = e.currentTarget.dataset.type;
        if (type == 'addCarts') {
            this.addToCart();
        } else {
            this.submitOrder();
        }
        setTimeout(function() {
            _this.util(e);
        }, 500);
    },

    drawerEvent: function(e) {
        var self = this;
        var index = e.currentTarget.dataset.type;
        var specs = this.data.specs;
        specs.forEach(v => {
            if (v.key == parseInt(e.currentTarget.dataset.type)) {
                v.selectedColor = "#f35b4a";
                self.setData({
                    specItem: v
                })
            } else {
                v.selectedColor = "black";
            }
        })
        this.setData({
            goods_price: specs[index].spec_price,
            goods_num: specs[index].spec_num,
            specs: specs,
            buyNum: 1
        })
    },

    drawerChangeCountEvent: function(e) {
        var num = this.data.buyNum;
        if (this.data.specItem) {
            if (e.currentTarget.dataset.num == "addCount") {
                if (++num > this.data.specItem.spec_num) {
                    return
                }
                this.setData({
                    buyNum: num
                })
            } else if (e.currentTarget.dataset.num == "minusCount") {
                if (--num == 0) {
                    return;
                }
                this.setData({
                    buyNum: num
                })
            }
        } else {
            if (e.currentTarget.dataset.num == "addCount") {
                if (++num > this.data.goods_num) {
                    return
                }
                this.setData({
                    buyNum: num
                })
            } else if (e.currentTarget.dataset.num == "minusCount") {
                if (--num == 0) {
                    return;
                }
                this.setData({
                    buyNum: num
                })
            }

        }

    },

    addToCart() {
        var self = this;
        var dic = new Object();
        dic.goods_id = commodity.id;
        dic.goods_num = this.data.buyNum != undefined ? (this.data.buyNum > 0 ? this.data.buyNum : 1) : 1;
        if (commodity.goods_spec == "1") {
            if (this.data.specItem) {
                dic.spec_id = this.data.specItem.spec_id;
                mallApi.addShoppingCart(dic, function(res) {
                    if (res.data.status == 1) {
                        wx.showToast({
                            title: '加入成功',
                        })
                    } else {
                        wx.showToast({
                            icon: "none",
                            title: '加入失败',
                        })
                    }
                }, function(err) {
                    wx.showToast({
                        icon: "none",
                        title: '网络出错',
                    })
                })
            } else {
                wx.showToast({
                    title: '请选择规格',
                })
            }

        } else {
            mallApi.addShoppingCart(dic, function(res) {
                if (res.data.status == 1) {
                    wx.showToast({
                        title: '加入成功',
                    })
                } else {
                    wx.showToast({
                        icon: "none",
                        title: '加入失败',
                    })
                }
            }, function(err) {
                wx.showToast({
                    icon: "none",
                    title: '网络出错',
                })
            })
        }
    },

    submitOrder() {
        var self = this;
        var dic = new Object();
        dic.goods_id = commodity.id;
        dic.goods_num = this.data.buyNum != undefined ? (this.data.buyNum > 0 ? this.data.buyNum : 1) : 1;
        dic.submit_type = "1";
        dic.goods_type = commodity.goods_type
        if (commodity.goods_spec == "1") {
            if (this.data.specItem) {
                dic.spec_id = this.data.specItem.spec_id;
                mallApi.submintedOrder(dic, function(res) {
                    if (res.data.status == 1) {
                        if(dic.goods_type == '1') {
                            var index = 1
                        }else{
                            var index = 0
                        }
                        wx.navigateTo({
                            url: '../order/order?orderType=1&data=' + JSON.stringify(res.data) + '&index=' + index,
                        })
                    } else {
                        wx.showToast({
                            icon: 'none',
                            title: '抱歉，结算出错',
                        })
                    }
                })
            } else {
                wx.showToast({
                    title: '请选择规格',
                })
            }
        } else {
            mallApi.submintedOrder(dic, function(res) {
                if (res.data.status == 1) {
                    wx.navigateTo({
                        url: '../order/order?orderType=1&data=' + JSON.stringify(res.data),
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '抱歉，结算出错',
                    })
                }
            })
        }

    },

    util: function(e) {

        var currentStatu = e.currentTarget.dataset.currentstatu;
        if (e.currentTarget.dataset.type) {
            this.setData({
                type: e.currentTarget.dataset.type
            })
        }

        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = animation;
        // animation.translateY(260).step();
        // this.setData({
        //   animationData: animation.export(),
        //   showModalStatus: true
        // })
        if (currentStatu == "close") {
            animation.translateY(520).step()
            this.setData({
                animationData: animation.export()

            })
            setTimeout(function() {
                animation.translateY(0).step();
                this.setData({
                    animationData: animation.export(),
                    showModalStatus: false
                });
            }.bind(this), 200)
        } else if (currentStatu == "open") {
            animation.translateY(520).step();
            this.setData({
                animationData: animation.export(),
                showModalStatus: true
            })
            setTimeout(function() {
                animation.translateY(0).step()
                this.setData({
                    animationData: animation.export(),
                })
            }.bind(this), 200)
        }
    },
    swiperIndex: function(e) {
        this.setData({
            index: e.detail.current
        })
    }
})