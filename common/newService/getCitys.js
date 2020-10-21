var qbService = require('service');
function getCitys(data,complete, fail) {
  qbService.request({
    path: "Weixin/DealerStore/getProvinceCityArea",
    data: data,
    method: "POST"
  }, function (res) {
    complete(res);
  }, function (err) {
    fail(err);
  })
}
module.exports = {
  getCitys: getCitys
}