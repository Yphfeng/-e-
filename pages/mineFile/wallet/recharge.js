// recharge.js
var oldMoneyType = 'money100';
const payment = require('../../../common/newService/payment.js');
var money = 100
Page({

    /**
     * 页面的初始数据
     */
    data: {

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
                    moneySubviewWidth: (res.screenWidth - 60) / 2,
                    money100: '#f35b4a',
                    money100Color: 'white',
                    money300: 'lightgray',
                    money300Color: 'black',
                    money50: 'lightgray',
                    money50Color: 'black',
                    money20: 'lightgray',
                    money20Color: 'black',
                    money10: 'lightgray',
                    money10Color: 'black',
                    money5: 'lightgray',
                    money5Color: 'black',
                })
            },
        })

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

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    // 去充值
    goRechargeAction: function () {

      payment.recharge(money, function(res){
          if (res.data.status == 1) {
            let jsonObject = JSON.parse(res.data.jsApiParameters);
            wx.requestPayment({
              timeStamp: jsonObject.timeStamp,
              nonceStr: jsonObject.nonceStr,
              package: jsonObject.package,
              signType: jsonObject.signType,
              paySign: jsonObject.paySign,
              success: function(res){
                console.log(res);
              },
              fail: function(res){
                console.log(res);
              }
            })
          }
      }, function(err){
          console.log(err);
      });
    },

    // 选择充值金额点击事件处理
    moneyTap: function (e) {
      
        var currentMoney = e.currentTarget.dataset.money
        if (currentMoney == oldMoneyType) {
            return;
        }
        oldMoneyType = e.currentTarget.dataset.money;
        switch (currentMoney) {
            case "money300":
                money = 300.00;
                this.setData({
                    money300: '#f35b4a',
                    money300Color: 'white',
                    money100: 'lightgray',
                    money100Color: 'black',
                    money50: 'lightgray',
                    money50Color: 'black',
                    money20: 'lightgray',
                    money20Color: 'black',
                    money10: 'lightgray',
                    money10Color: 'black',
                    money5: 'lightgray',
                    money5Color: 'black',
                })
                break;
            case "money100":
                money = 100.00;
                this.setData({
                    money300: 'lightgray',
                    money300Color: 'black',
                    money100: '#f35b4a',
                    money100Color: 'white',
                    money50: 'lightgray',
                    money50Color: 'black',
                    money20: 'lightgray',
                    money20Color: 'black',
                    money10: 'lightgray',
                    money10Color: 'black',
                    money5: 'lightgray',
                    money5Color: 'black',
                })
                break;
            case "money50":
                money = 50.00;
                this.setData({
                    money300: 'lightgray',
                    money300Color: 'black',
                    money50: '#f35b4a',
                    money50Color: 'white',
                    money100: 'lightgray',
                    money100Color: 'black',
                    money20: 'lightgray',
                    money20Color: 'black',
                    money10: 'lightgray',
                    money10Color: 'black',
                    money5: 'lightgray',
                    money5Color: 'black',
                })
                break;
            case "money20":
                money = 20.00;
                this.setData({
                    money300: 'lightgray',
                    money300Color: 'black',
                    money20: '#f35b4a',
                    money20Color: 'white',
                    money100: 'lightgray',
                    money100Color: 'black',
                    money50: 'lightgray',
                    money50Color: 'black',
                    money10: 'lightgray',
                    money10Color: 'black',
                    money5: 'lightgray',
                    money5Color: 'black',
                })
                break;
            case "money10":
                money = 10.00;
                this.setData({
                    money300: 'lightgray',
                    money300Color: 'black',
                    money10: '#f35b4a',
                    money10Color: 'white',
                    money100: 'lightgray',
                    money100Color: 'black',
                    money20: 'lightgray',
                    money20Color: 'black',
                    money50: 'lightgray',
                    money50Color: 'black',
                    money5: 'lightgray',
                    money5Color: 'black',
                })
                break;
            case "money5":
                money = 5;
                this.setData({
                    money300: 'lightgray',
                    money300Color: 'black',
                    money5: '#f35b4a',
                    money5Color: 'white',
                    money100: 'lightgray',
                    money100Color: 'black',
                    money20: 'lightgray',
                    money20Color: 'black',
                    money10: 'lightgray',
                    money10Color: 'black',
                    money50: 'lightgray',
                    money50Color: 'black',
                })
                break;
            default:
                break;
        }
    }
})