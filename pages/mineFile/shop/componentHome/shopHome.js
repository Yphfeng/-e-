// pages/mineFile/shop/shopHome/shopHome.js
var mallBanner = require('mallBanner');
var mallGoods = require('mallGoods');
var getGoodsType = require('mallGoodsType');
var app = getApp();

import templete from "../../../../components/tabBar/tabBar.js";

Page({
    /**
     * 组件的属性列表
     */

    /**
     * 组件的初始数据
     */
    data: {
        urlWWW: '',
        currentTab: 0,
        navScrollLeft: 0,
        navContents1: [],
        navContents2: [],
        imgheights: [],
        //图片宽度
        imgwidth: 750,
        current: 0
    },
    onLoad: function() {
        var self = this;
         templete.tabbar("tabBar", 0, this) //0表示第一个tabbar
        this.setData({
            urlWWW: app.urlWWW
        })
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    height: res.screenHeight - 64 - 55,
                    pixelRatio: res.pixelRatio,
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                })
            },
        })


    },
    onShow: function() {
        const self = this;
        mallBanner.initBanner(self);

        mallGoods.initGoods(self);
        getGoodsType.initGoodsType(self);
       
    },
    /**
     * 组件的方法列表
     */
    goodsItemEvent: function(e) {
        wx.navigateTo({
            url: '../commodity/commodity?commodityId=' + e.currentTarget.dataset.id,
        })
    },
    toList: function(e) {
        const id = e.currentTarget.id;
        wx.navigateTo({
            url: '../goodsList/goodsList?id=' + id,
        })
    },

    imageLoad: function(e) {
        //获取图片真实宽度
        console.log(e);
        var imgwidth = e.detail.width,
            imgheight = e.detail.height,
            //宽高比
            ratio = imgwidth / imgheight;
        console.log(imgwidth, imgheight)
        //计算的高度值
        var viewHeight = 750 / ratio;
        var imgheight = viewHeight
        var imgheights = this.data.imgheights
        //把每一张图片的高度记录到数组里
        imgheights.push(imgheight)
        this.setData({
            imgheights: imgheights,
        })
    },
    bindchange: function(e) {
        console.log(e.detail.current)
        this.setData({ current: e.detail.current })
    },

    created: function() {

    },


    ready: function() {


    },

    moved: function() {

    },

    detached: function() {

    }
})