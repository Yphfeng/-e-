// mine.js
const mineService = require('../../common/newService/mineService');
const pushService = require('../../common/newService/pushService.js');
import getAjax from '../../common/getAjax'
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userImage: "",
        containerViewHeight: "0",
        signTitle: "签到",
        isBusiness: true,
        isUser: false,
        navAction: 1,
        userText: '',
        isShowApplicationView: false,
        isShowIcon: true,
        indexed: 2
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let user_id = wx.getStorageSync("user_id") || ''
        this.setData({
            user_id: user_id,
          dataNavBar: app.dataNavBar
        })
        var self = this;


    },

    onReachBottom: function(options) {

    },

    onShow: function(oprtions) {


        var self = this;
        this.isAmbassador();
        this.getUserPoints();
        this.getSalesmanUserStatus();
        this.isBusiness();
        var user = wx.getStorageSync("user");
        if (user) {
            this.setData({
                userImage: user.wx_head_portrait,
            })
            if (user.armarium_science_user_name) {
                this.setData({
                    userName: user.armarium_science_user_name
                })
            } else {
                this.setData({
                    userName: user.wx_user_name
                })
            }
        } else {
            this.setData({
                userName: "微信用户",
                userImage: '../../images/me_normal.png'
            })
        }
        // wx.getStorage({
        //   key: 'user',
        //   success: function (res) {

        //     if (res.data.user_type == '1') {
        //       self.setData({
        //         isBusiness: true
        //       })
        //     }
        //   },
        // })


        this.isPoints();


    },
    goto(e) {
        // var index = e.currentTarget.dataset.index;
        // var url = this.data.dataNavBar[index].pagePath
        // wx.redirectTo({
        //     url: url
        // })
        console.log(getCurrentPages())
        var data = getCurrentPages();
        var d = 1;
        var url = e.currentTarget.dataset.url;
        for (var i = 0; i < data.length; i++) {
            if (data[i].route == url) {
                wx.navigateBack({
                    delta: i
                })
                d = 2;
            }
        }
        if (d !== 2) {
            wx.navigateTo({
                url: '/' + url
            })
        }

        // var index = e.currentTarget.dataset.index;
        //    var url_index = -1;
        //    var url = this.data.dataNavBar[index].pagePath;
        //    var number = wx.getStorageSync("number") || 0;
        //    var arr = wx.getStorageSync("arr") || []
        //    // var arr_a = wx.getStorageSync("arr_a") || 0
        //    // if(arr_a>4){
        //    //     arr_a = 0
        //    //     var arr = [];
        //    // }
        //    if (arr.length > 0) {
        //        for (var i = 0; i < arr.length; i++) {
        //            if (arr[i] == index) {
        //                var a = arr.slice(0, i + 1);
        //                url_index = i
        //                // arr_a = i

        //            }

        //        }
        //    }

        //    if (url_index !== -1) {
        //        number++
        //        if(number >= 3) {
        //                        // wx.setStorageSync("arr_a", arr_a + 1)
        //            wx.setStorageSync("arr", [])
        //            arr = [];
        //            arr.push(index)
        //            wx.setStorageSync("arr",arr)
        //            number = 1;
        //            wx.setStorageSync("number",number);
        //             wx.navigateTo({
        //                url: url + "?size=" + index,
        //                fail:function(err) {
        //                    console.log(err,'跳失败')
        //                }
        //            })

        //        }
        //        console.log(url_index, '执行返回')
        //        // wx.setStorageSync("arr_a", arr_a + 1)
        //        wx.setStorageSync("number",number)
        //        wx.setStorageSync("arr", a);
        //        wx.navigateBack({
        //            delta: url_index
        //        })
        //        wx.showToast({
        //            title: '跳失败2'
        //        })
        //    } else {
        //        // console.log(index)
        //        arr.push(index)
        //        number = 1

        //        // wx.setStorageSync("arr_a", arr_a + 1)
        //        wx.setStorageSync("arr", arr)
        //        wx.setStorageSync("number",number)
        //         wx.navigateTo({
        //            url: url + "?size=" + index,
        //            fail:function(err) {
        //                console.log(err,'跳失败')
        //            }
        //        })
        //    }

    },
    //判断商城是否显示
    isBusiness() {
        var self = this;
        mineService.getShopStatus(function(res) {
            if (res.data.shop_status == 1) {
                self.setData({
                    isBusiness: true
                })
            } else {
                self.setData({
                    isBusiness: false
                })
            }
        }, function(err) {

        })
    },
    //判断是否为健康大使
    isAmbassador() {
        var self = this;
        //判断是否是健康大使
        mineService.isAmbassador(function(res) {
            if (res.data.status == 2) {
                self.setData({
                    isAmbassador: '健康大使'
                })
            } else if (res.data.status == 1) {
                self.setData({
                    isAmbassador: '申请健康大使'
                })
            }
            var user_type = res.data.user_type;
            if (user_type == 1) {
                self.setData({
                    isUser: true,
                    userText: '渠道商',
                    navAction: user_type
                })
            } else if (user_type == 3) {
                self.setData({
                    isUser: true,
                    userText: '商户',
                    navAction: user_type
                })
            } else {
                self.setData({
                    isUser: false,
                    userText: '用户',
                    navAction: user_type
                })
            }
            if (user_type == 1) {
                self.setData({
                    isPanter: true
                })
            } else {
                self.setData({
                    isPanter: false
                })
            }
            var user = wx.getStorageSync("user");
            user.user_type = user_type;
            wx.setStorageSync("user", user);
        }, function(err) {
            console.log(err)
        })
    },
    editMessageAction(e) {
        const self = this;
        const user_id = wx.getStorageSync("user_id");
        const user = wx.getStorageSync("user");
        if (user) {
            wx.navigateTo({
                url: '../mineFile/mineProfile/mineProfile',
            })
        } else {
            // 获取用户信息
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                        wx.getUserInfo({
                            success: res => {
                                console.log(res);
                                // 可以将 res 发送给后台解码出 unionId
                                wx.setStorageSync("userInfo", res.userInfo);
                                getAjax.getPost("Weixin/Account/saveWeChatUserInfo", {
                                        wx_user_name: res.userInfo.nickName,
                                        head_portrait: res.userInfo.avatarUrl,
                                        user_id: user_id,
                                        open_id: app.globalData.open_id,
                                        login_type: 1
                                    })
                                    .then((response) => {
                                        if (response.data.status == 1) {
                                            wx.setStorageSync("user", response.data);
                                            self.isAmbassador();
                                            self.getUserPoints();
                                            self.isPoints();
                                            self.isBusiness();
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })

                                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                // 所以此处加入 callback 以防止这种情况
                                if (this.userInfoReadyCallback) {
                                    this.userInfoReadyCallback(res)
                                }
                            }
                        })
                    } else {
                        wx.authorize({
                            scope: 'scope.userInfo',
                            success() {
                                // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                                wx.getUserInfo({
                                    success: res => {
                                        console.log(res);
                                        // 可以将 res 发送给后台解码出 unionId
                                        wx.setStorageSync("userInfo", res.userInfo);
                                        getAjax.getPost("Weixin/Account/saveWeChatUserInfo", {
                                                wx_user_name: res.userInfo.nickName,
                                                head_portrait: res.userInfo.avatarUrl,
                                                user_id: user_id,
                                                open_id: app.globalData.open_id,
                                                login_type: 1
                                            })
                                            .then((response) => {
                                                if (response.data.status == 1) {
                                                    wx.setStorageSync("user", response.data);
                                                    self.isAmbassador();
                                                    self.getUserPoints();
                                                    self.isPoints();
                                                    self.isBusiness();
                                                }
                                            })
                                            .catch((err) => {
                                                console.log(err)
                                            })

                                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                        // 所以此处加入 callback 以防止这种情况
                                        if (this.userInfoReadyCallback) {
                                            this.userInfoReadyCallback(res)
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }

    },
    isPoints() {
        const self = this;
        mineService.getUserSignStatus(function(res) {
            if (res.data.status == 1) {
                self.setData({
                    signTitle: res.data.sign_status == 1 ? '已签到' : '签到'
                })
            }
        }, function(err) {
            wx.showToast({
                title: '网络出错',
            })
        })
    },

    formSubmit: function(e) {

        const formId = e.detail.formId;
        pushService.uploadFormId({
            form_id: formId,
            form_type: "2"
        }, function(res) {
            console.log(res);
        }, function(err) {});
    },


    signAction: function() {

        var self = this;
        if (this.data.signTitle == '已签到') { return; }
        var user = wx.getStorageSync("user");
        if (!user) { return; }
        mineService.createUserSign(function(res) {

            if (res.data.status == 1) {
                var content = '';
                var title = '签到成功';
                if (res.data.sign_status == 1) {
                    content = res.data.push.content;
                }
                if (res.data.reward_point != 0) {
                    title = '获得' + res.data.reward_point + '积分';
                }
                wx.showModal({
                    title: title,
                    content: content,
                    showCancel: false
                });
                self.setData({
                    signTitle: '已签到'
                })
            } else {
                wx.showToast({
                    title: '签到失败',
                })
            }
        }, function(err) {
            wx.showToast({
                title: '网络出错',
            })
        })
    },

    moneyContainerAction(e) {

        let value = e.currentTarget.dataset.money;
        var url = "";
        switch (value) {
            case "qianbao":
                url = "../mineFile/wallet/wallet";
                break;
            case "jifen":
                url = "../mineFile/integral/integral";
                break;
            case 'shenqing':
                let type = e.currentTarget.dataset.type;
                if (type == '健康大使') {
                    url = '../mineFile/integral/ambassadorOk/ambassadorOk'
                } else {
                    url = '../mineFile/integral/ambassador/ambassador'
                }
            default:
                break;
        }
        wx.navigateTo({
            url: url,
        })
    },
    getUserPoints: function() {
        let self = this;
        mineService.getUserPoints(function(res) {
            if (res.statusCode == 200 && res.data.status == 1) {
                if (self.data.isAmbassador == "健康大使") {
                    self.setData({
                        isShowApplicationView: true
                    })
                } else {
                    self.setData({
                        isShowApplicationView: parseInt(res.data.points) >= 2000 ? true : false
                    })
                }
                self.setData({
                    userPoints: res.data.points,
                })
            } else {
                wx.showToast({
                    icon: 'none',
                    title: res.data.msg ? res.data.msg : '网络出错',
                })
            }
        }, function(err) {})
    },
    getSalesmanUserStatus: function() {
        let self = this;
        mineService.getSalesmanUserStatus(function(res) {
            if (res.statusCode == 200 && res.data.status == 1) {
                self.setData({
                    salesmanTitle: res.data.audit_status ? res.data.audit_status : '申请为健康大使',
                })
            }
        }, function(err) {
            console.log(err);
        })
    },
    applicationContainerAction(e) {

        let value = e.currentTarget.dataset.application;
        var url = "";
        switch (value) {
            case "BSM":
                if (app.getBoolSugarTimePeriodNames() == null) {
                    url = '../boolSugaChooseType/boolSugaChooseType';
                } else {
                    url = '../boolSugaData/boolSugaData';
                }
                break;
            case "qrCode":
                url = '../mineFile/Invited/invited';
                break;
            case "shangcheng":
                url = '../mineFile/shop/componentHome/shopHome';
                break;
            case "xiaoxi":
                url = '../mineFile/message/message';
                break;
            case "yaoqing":
                url = "../mineFile/Invited/invited";
                break;
            case "shoppoingCart":
                url = '../mineFile/shop/shoppingCar/shoppingCar';
                break;
            case "woshihuoban":
                url = '../mineFile/businessFile/business/business';
                break;
            case "orderManager":
                url = '../mineFile/shop/orderManager/orderManager';
                break;
            case 'channnel':
                url = '../channelProvider/index/index';
                break;
            case 'merchants':
                url = '../merchants/index/index';
                break;
            default:
                break;
        }
        if (url.length == 0 || url == undefined) {
            return;
        } else {
            wx.navigateTo({
                url: url,
            })
        }
    },
    getuserinfo(e) {
        const self = this;
        const user = wx.getStorageSync("user");
        const user_id = wx.getStorageSync("user_id");
        wx.getUserInfo({
            success: function(res) {
                if (user) {} else {
                    getAjax.getPost("Weixin/Account/saveWeChatUserInfo", {
                            wx_user_name: e.detail.userInfo.nickName,
                            head_portrait: e.detail.userInfo.avatarUrl,
                            user_id: self.data.user_id,
                            open_id: app.globalData.open_id,
                            login_type: 1
                        })
                        .then((response) => {
                            if (response.data.status == 1) {
                                wx.setStorageSync("user", response.data.data);
                                wx.setStorageSync("userInfo", e.detail.userInfo);
                                self.setData({
                                    userImage: response.data.data.wx_head_portrait,
                                })
                                if (user.armarium_science_user_name) {
                                    self.setData({
                                        userName: response.data.data.armarium_science_user_name
                                    })
                                } else {
                                    self.setData({
                                        userName: response.data.data.wx_user_name
                                    })
                                }
                                self.isAmbassador();
                                self.getUserPoints();
                                self.isPoints();
                                self.isBusiness();
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            },
            fail: function(err) {
                console.log(err, '失败')
            }
        })
    }
})