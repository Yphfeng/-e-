var qbService = require('service.js');

function order(orderId, complete, fail) {

  wx.login({
    success: function (res) {
      console.debug('code:', res.code);
      qbService.request({
        path: "Weixin/Pay/payment",
        data: {
          code: res.code,
          order_id: orderId
        },
        method: "POST"
      }, complete, fail)
    }
  })
}

function deposit(complete, fail) {

  wx.login({
    success: function (res) {
      qbService.request({
        path: 'Weixin/Pay/depositPayment',
        data: {
          code: res.code
        },
        method: 'POST'
      }, complete, fail)
    }
  })
}

function recharge(money, complete, fail) {

  wx.login({
    success: function (res) {
      qbService.request({
        path: 'Weixin/Pay/userMoneyRecharge',
        data: {
          code: res.code,
          payment_money: money
        },
        method: 'POST',
      }, complete, fail);
    }
  })
}

function refund(money, complete, fail) {

  qbService.request({
    path: 'Weixin/Pay/depositPayRefund',
    data: {
      refund: money
    },
    method: 'POST',
  }, complete, fail);
}

function depositRefund(complete, fail) {

  qbService.request({
    path: 'Weixin/User/withdrawDeposit',
    data: {},
    method: 'POST'
  }, complete, fail)
}

module.exports = {
  order: order,
  deposit: deposit,
  refund: refund,
  depositRefund: depositRefund,
  recharge: recharge
}