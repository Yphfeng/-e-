// pages/mineFile/shop/shopCart/shopCart.js
var mallApi = require('../../../../common/newService/mallService');
var app = getApp();
import templete from "../../../../components/tabBar/tabBar.js";
Page({


    /**
     * 组件的初始数据
     */
    data: {
        carts: [],
        hasList: false,
        totalPrice: 0.00,
        selectAllStatus: false
    },
    onLoad: function() {
        templete.tabbar("tabBar", 1, this) //0表示第一个tabbar
    },

    onShow: function() {

        var self = this;
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    scrollviewHeight: res.screenHeight - 64 - 49 - 49
                })
            },
        });

        mallApi.getShoppingCart(function(res) {

            if (res.data.status == '0') {
                wx.showToast({
                    title: res.data.msg,
                })
                self.setData({
                    carts: [],
                    totalPrice: 0,
                    selectAllStatus: false
                })
                return;
            }
            var shoppingCarts = res.data.cart_list;
            if (shoppingCarts.length == 0) {
                self.setData({
                    isHaveGoods: true,
                    carts: [],
                    totalPrice: 0,
                    selectAllStatus: false
                })
                return;
            }
            var carts = [];

            shoppingCarts.forEach((item) => {

                let cart = {
                    id: item.id,
                    title: item.goods_name,
                    image: item.goods_img_url,
                    num: parseInt(item.goods_num),
                    price: parseFloat(item.goods_price).toFixed(2),
                    isIntegral: item.goods_price == "1" ? true : false,
                    selected: item.selected == '1' ? true : false,
                    specName: item.spec_name ? item.spec_name : "",
                };
                carts.push(cart);
            });
            self.getTotalPrice(carts);
        }, function(err) {
            wx.showToast({
                title: '网络出错',
            })
            self.setData({
                carts: []
            })
        });
    },
    selectList: function(e) {

        var self = this;
        const index = e.currentTarget.dataset.index;
        var carts = this.data.carts;
        let selected = !carts[index].selected;
        let status = selected === true ? "1" : "0";
        mallApi.seleteGoodsOfShoppingCart({
            cart_id: carts[index].id,
            status: status
        }, function(res) {
            if (res.data.status == 1) {
                carts[index].selected = selected;
                self.getTotalPrice(carts);
            } else {
                wx.showToast({
                    title: '失败',
                })
            }
        }, function(err) {
            wx.showToast({
                title: '网络出错',
            })
        })
    },

    selectAll: function(e) {

        var self = this;
        let selectAllStatus = this.data.selectAllStatus;
        selectAllStatus = !selectAllStatus;
        var carts = this.data.carts;
        mallApi.allSelecteGoodsOfShoppingCar(selectAllStatus, function(res) {

            if (res.data.status == 1) {
                carts.forEach(v => {
                    v.selected = selectAllStatus
                })
                self.getTotalPrice(carts);
            } else {
                wx.showToast({
                    title: '失败',
                })
            }
        }, function(err) {
            wx.showToast({
                title: '网络出错',
            })
        })
    },

    addCount: function(e) {

        var self = this;
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        mallApi.addGoodsNumOfShoppingCart(carts[index].id, function(res) {

            if (res.data.status == 1) {
                let num = carts[index].num;
                num = num + 1;
                carts[index].num = num;
                self.getTotalPrice(carts);
            } else {
                wx.showToast({
                    title: '增加失败',
                })
            }
        }, function(err) {
            wx.showToast({
                title: '网络出错',
            })
        })
    },

    minusCount: function(e) {

        var self = this;
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        let num = carts[index].num;
        if (num <= 1) {
            return false;
        }
        mallApi.reduceGoodsOfShoppingCart(carts[index].id, function(res) {
            if (res.data.status == 1) {

                num = num - 1;
                carts[index].num = num;
                self.getTotalPrice(carts);
            } else {
                wx.showToast({
                    title: '减少失败',
                })
            }
        }, function(err) {
            wx.showToast({
                title: '网络出错',
            })
        })
    },

    deleteList: function(e) {
        var self = this;
        let index = e.currentTarget.dataset.index;
        var carts = this.data.carts;
        mallApi.delegateGoodsOfShoppingCart(carts[index].id, function(res) {
            if (res.data.status == 1) {
                carts.splice(index, 1);
                self.getTotalPrice(carts);
            } else {
                wx.showToast({
                    title: '删除失败',
                })
            }
        }, function(err) {
            wx.showToast({
                title: '网络出错',
            })
        })
    },


    getTotalPrice(carts) {

        if (carts.length == 0) {
            this.setData({
                carts: [],
                totalPrice: 0,
                selectAllStatus: false
            })
            return;
        }

        var totalPrice = 0;
        var selectedCount = 0
        carts.forEach((v, index) => {

            v.shoppingCarList = index;
            v.index = index;
            if (v.selected) {
                selectedCount += 1
                totalPrice += parseFloat(v.num) * parseFloat(v.price)
            }
        })

        this.setData({
            carts: carts,
            selectAllStatus: selectedCount == carts.length ? true : false,
            totalPrice: totalPrice.toFixed(2)
        })
    },

    submitedOrder: function(e) {

        const carts = this.data.carts;
        var selectedCount = 0;
        carts.forEach(v => {
            if (v.selected) {
                selectedCount += 1;
            }
        })
        // if (selectedCount != carts.length) {
        //     wx.showToast({
        //         title: '请选择商品',
        //     })
        //     return;
        // }
               if (selectedCount == 0) {
            wx.showToast({
                title: '请选择商品',
            })
            return;
        }

        mallApi.submintedOrder({
            submit_type: "0"
        }, function(res) {
            if (res.data.status == 1) {
                wx.navigateTo({
                    url: '../order/order?data=' + JSON.stringify(res.data) + "&orderType=0",
                })
            } else {
                wx.showToast({
                    title: '抱歉，结算出错',
                })
            }

        }, function(err) {
            wx.showToast({
                title: '网络出错',
            })
        })
    },

})