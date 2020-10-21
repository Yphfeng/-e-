let qbService = require('service.js');

function addMailAddress(data, complete, fail) {
  qbService.request({
    path: "Weixin/User/AddUserMailAddress",
    data: data,
    method: "POST"
  }, complete, fail);
}

function removeMailAddress(data, complete, fail) {
  qbService.request({
    path: "Weixin/User/deleUserMailAddress",
    data: data,
    method: "POST"
  }, complete, fail);
}

function updateMailAddress(data, complete, fail) {
  qbService.request({
    path: "Weixin/User/deleUserMailAddress",
    data: data,
    method: "POST"
  }, complete, fail);
}

function getMailAddress(complete, fail) {

  qbService.request({
    path: "Weixin/User/getUserMailAddress",
    data: {},
    method: "POST"
  }, complete, fail);
}

module.exports = {
  addMailAddress: addMailAddress,
  removeMailAddress: removeMailAddress,
  updateMailAddress: updateMailAddress,
  getMailAddress: getMailAddress
}