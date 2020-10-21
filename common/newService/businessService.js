
var qbService = require('service');


function businessHomeData(complete, fail) {
  qbService.request({
    path: "Weixin/Wholesaler/getIndexData",
    data: {},
    method: "POST"
  }, complete, fail)
}

function getUserList(data, complete, fail) {
  qbService.request({
    path: "Weixin/Wholesaler/getWholesalerInviteUserlist",
    data: data,
    method: "POST"
  }, complete, fail)
}

function getWholesalerDevice(data, complete, fail) {
  qbService.request({
    path: "Weixin/Wholesaler/getWholesalerDevice",
    data: data,
    method: "POST"
  }, complete, fail)
}

function getWholesalerSubUser(data, complete, fail) {
  qbService.request({
    path: "Weixin/Wholesaler/getWholesalerSubUser",
    data: data,
    method: "POST"
  }, complete, fail)
}

function getWholesalerProfit(data, complete, fail) {

  qbService.request({
    path: "Weixin/Wholesaler/getWholesalerProfit",
    data: data,
    method: "POST"
  }, complete, fail)
}
module.exports = {
  businessHomeData: businessHomeData,
  getUserList: getUserList,
  getWholesalerDevice: getWholesalerDevice,
  getWholesalerSubUser: getWholesalerSubUser,
  getWholesalerProfit: getWholesalerProfit
}