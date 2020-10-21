// const goodHandle = require('../shop/mall/mallGoods.js');
const bluetoothManager = require('../../bluetooth/manager');
const bluetoothApi = require('../../bluetooth/api');
const transceiver = require('../../bluetooth/transceiver').transceiver;
const transceiverObject = new transceiver();
const courseService = require('../../common/newService/courseService');
const qbDate = require('../../common/qbDate.js');
const getDeviceDataHandle = require('../deviceData/getDeviceDataHandle.js');
const app = getApp();
var courseDatas = [];
var coursesOfBuy = [];
var switchIndex = 0;
var myTimeOut;
var remainingDays = 0;

function updateUI(self) {

    var courseArrayUI = new Array();
    courseDatas.forEach(function(v, index) {

        var _remainingDays = v.remaining_days ? parseInt(v.remaining_days) : 0;
        _remainingDays = _remainingDays + (v.add_day ? parseInt(v.add_day) : 0);
        var courseStatus = v.course_status;
        if (v.update_status + '' == "1") {
            courseStatus = "4";
        }
        var course = {
            "course": index,
            "data": {
                myCourseBottomBorderWidth: 1,
                useState: courseStatus,
                eventIndex: index,
                courseName: v.course_name,
                display: v.dispaly,
                remainingDays: _remainingDays,
            }
        }
        courseArrayUI.push(course);
    })
    self.setData({
        courses: courseArrayUI
    })
}

function initUserDeviceCourse(self) {

    if (app.getDeviceInfo().isConnect) {
        getRemainingDays();
    }
}

function getUserDeviceCourseList(self) {
    courseDatas = [];
    courseService.getUserCourseList({
        device_sn: app.getDeviceInfo().deviceIdentificationCode
    }, function(res) {
        if (res.data.status == 1 && res.statusCode == 200) {
            if (res.data.course_list.length > 0) {
                courseDatas = res.data.course_list;
                updateUI(self);
                return;
            }
        }
        wx.showToast({
            icon: 'none',
            title: '网络错误',
        })
    }, function(err) {
        wx.showToast({
            icon: 'none',
            title: '网络错误',
        })
    })
}

function initUserBuyCourse(self) {

    courseService.getUserArticleList(function(res) {
        if (res.statusCode == 200) {
            if (res.data.status == 0) {
                self.setData({
                    coursesOfBuy: []
                })
                return
            }
            var _coursesOfBuy = new Array();
            coursesOfBuy = res.data.course_list;
            res.data.course_list.forEach((v, index) => {
                let item = {
                    "course": index,
                    "data": {
                        useState: "5",
                        eventIndex: index,
                        courseName: v.course_goods_name,
                        remainingDays: v.course_days,
                    }
                }
                _coursesOfBuy.push(item);
            })
            self.setData({
                coursesOfBuy: _coursesOfBuy
            })
        } else {
            wx.showToast({
                icon: 'none',
                title: '网络出错',
            })
        }
    }, function(err) {
        wx.showToast({
            icon: 'none',
            title: '网络错误',
        })
    })
}

function activeCourse(index, self) {

    var courseId = courseDatas[index].id
    if (courseId == undefined || courseId == null) {
        wx.showToast({
            title: '激活失败',
        })
        return;
    }
    wx.showLoading({
        title: '激活中...',
    })
    myTimeOut = setTimeout(function() {
        wx.hideLoading();
        wx.showToast({
            title: '激活失败',
        })
    }, 15000)
    courseService.activeCourse(courseId, function(res) {
        wx.hideLoading();
        if (res.data.status == 1) {
            wx.showToast({
                title: '激活成功',
            })
            courseDatas[index].course_status = '2';
            updateUI(self);
        } else {
            wx.showToast({
                title: '激活失败',
            })
        }
    }, function(err) {
        wx.showToast({
            title: '网络出错',
        })
    })
}

function switchCourse(index) {

    wx.showLoading({
        title: '切换中...',
        mark: true
    })
    myTimeOut = setTimeout(function() {
        wx.hideLoading();
        wx.showToast({
            title: '切换超时',
        })
    }, 15000);
    switchIndex = index;
    writeTreartmentToDevice(courseDatas[index].id);

}

function getRemainingDays() {
    bluetoothManager.getLaserTreatmentParameters();
}

function updateCourseToBLE(index) {

    wx.showLoading({
        title: '更新中...',
    })
    myTimeOut = setTimeout(function() {
        wx.hideLoading();
        wx.showToast({
            title: '更新超时',
        })
    }, 15000);
    switchIndex = index;
    writeTreartmentToDevice(courseDatas[index].id);
}

function updateCourse(self) {

    const dic = {
        device_sn: app.getDeviceInfo().deviceIdentificationCode,
        user_course_id: courseDatas[switchIndex].id
    }
    courseService.updateUserCourseStatus(dic, function(res) {
        if (res.data.status == 1 && res.statusCode == 200) {
            courseDatas.forEach((v, index) => {
                if (index == switchIndex) {
                    v.course_status = '1';
                    v.update_status = '0';
                } else if (v.course_status == '1') {
                    v.course_status = '2';
                }
            })
            updateUI(self);
            wx.showToast({
                title: '切换成功',
            })
            //切换成功后上传一次数据
            // getDeviceDataHandle.getDeviceData(self, "allData", function(r) {
            //     console.log("切换疗程时上传数据成功")
            // }, function(er) {
            //     console.log("切换疗程时要上传数据失败")
            // })
        }
    }, function(err) {

    })
}


function bindingDevice(index) {
    wx.navigateTo({
        url: 'deviceBinding/deviceBinding?courseId=' + coursesOfBuy[index].id,
    })
}

function onBLE(self) {


    transceiverObject.receiveMessage(function(dataObject) {
        console.log(dataObject,"切换疗程时上传数据成功");
        const body = dataObject.body;
        switch (dataObject.cmd) {
            case bluetoothApi.kGXYL_LaserRegimenParameters:

                clearTimeout(myTimeOut);
                wx.hideLoading();
                if (body.setState == '设置成功') {
                    updateCourse(self);
                } else {
                    wx.showToast({ title: body.setState });
                }
                break;
            case bluetoothApi.kGXYL_GetLaserRegimenParameters:
                // var _remainingDays;
                // if (body.treatmentDurationType == "0") {
                //     _remainingDays = body.remainingDays;
                // } else if (body.treatmentDurationType == "1") {
                //     const newDate = new Date();
                //     const todayString = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + '-' + newDate.getDate();
                //     _remainingDays = qbDate.dateDiff(todayString, body.endDate);
                // }
                // courseService.updateCourseDays({
                //     device_sn: app.getDeviceInfo().deviceIdentificationCode,
                //     remaining_days: _remainingDays,
                //     course_sn:body.sequence
                // }, function(res) {
                //     if (res.data.status == 1 && res.statusCode == 200) {
                        getUserDeviceCourseList(self)
                    // } else {
                    //     wx.showToast({
                    //         icon: 'none',
                    //         title: res.data.msg ? res.data.msg : '网络出错',
                    //     })
                    // }
                // }, function(err) {
                //     wx.showToast({
                //         icon: 'none',
                //         title: '网络出错',
                //     })
                // });
            default:
                break;
        }
    });
}
//把激光疗程参数写入设备
function writeTreartmentToDevice(id) {

    courseService.getCourseParameter(id, function(res) {
        if (res.data.status == 1 && res.statusCode == 200) {
            var parametersArray = [];
            res.data.parameter_list.forEach(v => {
                let item = {
                    power: parseInt(v.power_level),
                    duration: parseInt(v.start_duration),
                    startHour: parseInt(v.start_time.split(":")[0]),
                    startMinute: parseInt(v.start_time.split(":")[1]),
                }
                parametersArray.push(item);
            })
            var courseNumber = parseInt(res.data.course_data.course_type_sn);
            var coursePeriodic = parseInt(res.data.course_data.course_cycle_work_days);
            var courseGap = parseInt(res.data.course_data.course_cycle_rest_days);
            var _remainingDays = res.data.use_course_time.remaining_days;
            var _add_days = res.data.use_course_time.add_day;
            var courseEndDate = qbDate.getNewDay((_remainingDays ? parseInt(_remainingDays) : 0) + (_add_days ? parseInt(_add_days) : 0)).split('-');

            const dic = {
                index: courseNumber,
                periodic: coursePeriodic,
                gap: courseGap,
                endDate: courseEndDate,
                parameters: parametersArray
            }

            bluetoothManager.setLaserTreatmentParameters(dic);
        } else {
            wx.hideLoading();
            clearTimeout(myTimeOut);
            wx.showToast({
                icon: 'none',
                title: res.data.msg ? res.data.msg : '获取参数失败',
            })
        }
    }, function(err) {
        wx.hideLoading();
        clearTimeout(myTimeOut);
        wx.showToast({
            title: '网络错误',
        })
    })
}


function showHelp(index) {

    var content = courseDatas[index].notes;
    wx.showModal({
        title: '疗程说明',
        content: content,
    })
}

function clean() {
    courseDatas = [];
}

module.exports = {
    clean: clean,
    initUserDeviceCourse: initUserDeviceCourse,
    initUserBuyCourse: initUserBuyCourse,
    activeCourse: activeCourse,
    switchCourse: switchCourse,
    onBLE: onBLE,
    showHelp: showHelp,
    bindingDevice: bindingDevice,
    updateCourseToBLE: updateCourseToBLE,
    getRemainingDays: getRemainingDays
}