var mallApi = require('../../../../common/newService/mallService');
var app = getApp();


Page({
    data: {
        carts: [],
        hasList: false,
        totalPrice: 0.00,
        selectAllStatus: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var self = this;
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    scrollviewHeight: res.screenHeight - 64 - 49
                })
            },
        })
    },
    onShow() {
        this.initUI();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    // 选择商品
    selectList(e) {

        var self = this;
        const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
        var carts = this.data.carts; // 获取购物车列表
        let selected = !carts[index].data.selected;
        let status = selected === true ? "1" : "0";
        mallApi.seleteGoodsOfShoppingCart({
            cart_id: carts[index].data.id,
            status: status
        }, function(res) {
            if (res.data.status == 1) {
                carts[index].data.selected = selected;
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


    selectAll(e) {

        var self = this;
        let selectAllStatus = this.data.selectAllStatus;
        selectAllStatus = !selectAllStatus;
        var carts = this.data.carts;
        mallApi.allSelecteGoodsOfShoppingCar(selectAllStatus, function(res) {

            if (res.data.status == 1) {
                carts.forEach(v => {
                    v.data.selected = selectAllStatus
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


    addCount(e) {

        var self = this;
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        mallApi.addGoodsNumOfShoppingCart(carts[index].data.id, function(res) {

            if (res.data.status == 1) {
                let num = carts[index].data.num;
                num = num + 1;
                carts[index].data.num = num;
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


    minusCount(e) {

        var self = this;
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        let num = carts[index].data.num;
        if (num <= 1) {
            return false;
        }
        mallApi.reduceGoodsOfShoppingCart(carts[index].data.id, function(res) {
            if (res.data.status == 1) {

                num = num - 1;
                carts[index].data.num = num;
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


    deleteList(e) {
        var self = this;
        let index = e.currentTarget.dataset.index;
        var carts = this.data.carts;
        mallApi.delegateGoodsOfShoppingCart(carts[index].data.id, function(res) {
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
            v.data.index = index;
            if (v.data.selected) {
                selectedCount += 1
                totalPrice += parseFloat(v.data.num) * parseFloat(v.data.price)
            }
        })

        this.setData({
            carts: carts,
            selectAllStatus: selectedCount == carts.length ? true : false,
            totalPrice: totalPrice.toFixed(2)
        })
    },


    initUI() {

        var self = this
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

            var type = shoppingCarts.every((i, index) => {
                return i.goods_type == 0
            })
            if (type == true) {
                self.setData({
                    index: 0
                })
            } else {
                self.setData({
                    index: 1
                })
            }
            shoppingCarts.forEach((item, index) => {

                let cart = {
                    "shoppingCarList": index,
                    "data": {
                        id: item.id,
                        title: item.goods_name,
                        image: item.goods_img_url,
                        num: parseInt(item.goods_num),
                        price: parseFloat(item.goods_price).toFixed(2),
                        isIntegral: item.goods_price == "1" ? true : false,
                        selected: item.selected == '1' ? true : false,
                        specName: item.spec_name ? item.spec_name : "",
                        index: index
                    }
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


    clearingAction: function() {
      const self = this;

        const carts = this.data.carts;
        var selectedCount = 0
        carts.forEach(v => {
            if (v.data.selected) {
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
                    url: '../order/order?data=' + JSON.stringify(res.data) + "&orderType=0&index=" + self.data.index,
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
    }
})