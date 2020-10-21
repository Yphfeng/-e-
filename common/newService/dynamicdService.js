let qbService = require('./service.js');

function getShareUserContent(data, complete, fail) {

  qbService.request({
    path: 'Weixin/Map/getShareUserContent',
    data: data,
    method: 'POST'
  }, complete, fail)
}

module.exports = {
  getShareUserContent: getShareUserContent
}