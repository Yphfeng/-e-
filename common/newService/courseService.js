let qbService = require('service');

function getUserCourseList(data, complete, fail) {
  qbService.request({
    path: "Weixin/UserCourse/getUserCourselist",
    data: data,
    method: "POST"
  },complete, fail)
}

function activeCourse(courseId,complete, fail) {

  qbService.request({
    path: "Weixin/Course/activateUserCourse",
    data: {
      user_course_id: courseId
    },
    method: "POST"
  },complete, fail);
}

function getCourseParameter(courseId, complete, fail) {

  qbService.request({
    path: "Weixin/UserCourse/getUserUseCourse",
    data: {
      user_course_id: courseId
    },
    method: "POST"
  }, complete, fail);
}

function updateUserCourseStatus(data, complete, fail) {

  qbService.request({
    path: 'Weixin/UserCourse/updateUserCourseStatus',
    data: data,
    method: "POST"
  }, complete, fail);
}

function updateCourseDays(dataDic, complete, fail) {
  
  qbService.request({
    path: 'Weixin/UserCourse/updateDeviceUseCourse',
    data: dataDic,
    method: "POST"
  }, complete, fail)
}

function getFistConnectTreatmentInfo(data, complete, fail) {
console.log(data);
  qbService.request({
    path: 'Weixin/UserCourse/getWriteDeviceInfo',
    data: data,
    method: 'POST',
  }, complete, fail);
}

function setFirstConnectTreatmentInfo(data,complete, fail) {
  qbService.request({
    path: 'Weixin/UserCourse/setCrowdfundingCourseGiveStatus',
    data: data,
    method: 'POST'
  }, complete, fail);
}

function getUserArticleList(complete, fail) {

  qbService.request({
    path: 'Weixin/UserArticle/getUserArticleList',
    data: {},
    method: 'POST'
  }, complete, fail);
}

function bindUserArticle(dic, complete, fail) {
  qbService.request({
    path: 'Weixin/UserArticle/bindUserArticle',
    data: dic,
    method: 'POST'
  }, complete, fail);
}



module.exports = {
  getUserCourseList: getUserCourseList,
  activeCourse: activeCourse,
  getCourseParameter: getCourseParameter,
  updateUserCourseStatus: updateUserCourseStatus,
  updateCourseDays: updateCourseDays,
  setFirstConnectTreatmentInfo: setFirstConnectTreatmentInfo,
  getFistConnectTreatmentInfo: getFistConnectTreatmentInfo,
  getUserArticleList: getUserArticleList,
  bindUserArticle: bindUserArticle
}