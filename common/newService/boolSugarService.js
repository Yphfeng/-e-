var qbService = require('service.js');

function getBloodSugarData(data, complete, fail) {

  qbService.request({
    method: "POST",
    data: {
      num: data.num,
      type: data.type
    },
    path: 'Weixin/UserData/getUserBloodSugarPreviousFiveData'
  }, complete, fail)
}

function updateBloodSugarData(data, complete, fail) {
  qbService.request({
    method: 'POST',
    data: data,
    path: "Weixin/UserData/setUserBloodSugarData"
  }, complete, fail)
}

module.exports = {
  getBloodSugarData: getBloodSugarData,
  updateBloodSugarData: updateBloodSugarData
}