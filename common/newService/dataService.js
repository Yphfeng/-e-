const qbService = require('service');

function getUserAllLastData(complete, fail) {
  qbService.request({
    path: 'Weixin/UserData/getUserAllLastData',
    data: {},
    method: 'POST'
  }, complete, fail)
}

function updateHeartRateData(dic, complete, fail) {

  qbService.request({
    path: 'Weixin/UserData/uploadUserHeartRateDataC',
    data: dic,
    method: 'POST'
  }, complete, fail)
}

function updateLaserData(dic, complete, fail) {
  qbService.request({
    path: 'Weixin/UserData/uploadLaserDadaC',
    data: dic,
    method: 'POST'
  }, complete, fail);
}

function updateMovementData(dic, complete, fail) {
  qbService.request({
    path: 'Weixin/UserData/uploadMotionDada',
    data: {
      movementData: dic.movementData,
      movementLastData: dic.movementLastData
    },
    method: 'POST'
  }, complete, fail);
}

function getMotionData(data, complete, fail) {

  qbService.request({
    path: 'Weixin/UserData/getUserMotionDataC',
    data: data,
    method: "POST"
  },complete, fail);
}

function getLaserData(data, complete, fail) {

  qbService.request({
    path: 'Weixin/UserData/getUserLasereDataC',
    data: data,
    method: 'POST'
  }, complete,fail);
}

function getHeartRateData(data, complete, fail) {

  qbService.request({
    path: 'Weixin/UserData/getUserHeartRateDataC',
    data: data,
    method: 'POST'
  },complete, fail);
}

function getUserCourseSnList(complete, fail) {

  qbService.request({
    path: 'Weixin/UserData/getUserCourseSnList',
    data: {},
    method: 'POST'
  }, complete, fail);
}

module.exports = {
  getUserAllLastData: getUserAllLastData,
  updateHeartRateData: updateHeartRateData,
  updateLaserData: updateLaserData,
  updateMovementData: updateMovementData,
  getMotionData: getMotionData,
  getHeartRateData: getHeartRateData,
  getLaserData: getLaserData,
  getUserCourseSnList: getUserCourseSnList
}