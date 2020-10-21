let qbService = require('./service.js');
function getLatsetVersion(data, complete, fail) {
  qbService.request({
    path: 'Admin/UpDevice/getNewestFirmwareVersion',
    data: data,
    method: 'POST'
  }, complete, fail)
}

module.exports = {
  getLatsetVersion: getLatsetVersion
}