
const qbService = require('service');

function uploadFormId(data, complete, fail) {
  if (data.form_id.length != 32) {
    return
  }
  qbService.request({
    path: "Weixin/User/addWxPushFormId",
    data: data,
    method: "POST"
  }, complete, fail);
}
module.exports = {
  uploadFormId: uploadFormId
}