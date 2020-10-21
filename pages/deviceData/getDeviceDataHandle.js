var dataService = require('../../common/newService/dataService.js');
var qbDate = require('../../common/qbDate.js');
var homeBluetooth = require('../home/homeBluetooth.js');
var qbBLEManager = require('../../bluetooth/manager.js');
var bluetoothApi = require('../../bluetooth/api.js');

var app = getApp();


var heartRateData = [];
var hrDayData = new Object();
// var hrDayData = [];
var laserData = [];
var laserDayData = [];
var movementData = [];

var heartRateLastData = new Object();
var laserLastData = new Object();
var movementLastData = new Object();

var dateArray;


var motionDayCount = 0;
var laserDayCount = 0;
var heartRateDayCount = 0;

var motionTotalCount = 0;
var laserTotalCount = 0;
var heartRateTotalCount = 0;
var heartRateIndex = 0;
var laserIndex = 0;

var lastData;

var that;

function save(dic) {

    switch (dic.type) {
        case 'motion':
            var stepsNum = dic.data.length == 4 ? dic.data[0] | dic.data[1] << 8 | dic.data[2] << 16 | dic.data[3] << 24 : 0;
            const user = app.getUser();
            var motionItem = {
                user_id: user.user_id,
                y: dateArray[0],
                m: dateArray[1],
                d: dateArray[2],
                steps_num: stepsNum,
                time: getTime(dateArray[0], dateArray[1], dateArray[2])
            }
            movementData.push(JSON.stringify(motionItem));
            movementLastData = {
                user_id: user.user_id,
                y: dateArray[0],
                m: dateArray[1],
                d: dateArray[2],
                time: Math.round(new Date().getTime() / 1000)
            }
            return true
        case 'heartRate':

            if (dic.data.length == 1 && dic.data[0] == 4) {

                const user = app.getUser();
                if (Object.keys(hrDayData).length != 0) {

                    heartRateData.push({
                        user_id: user.user_id,
                        y: dateArray[0],
                        m: dateArray[1],
                        d: dateArray[2],
                        time: getTime(dateArray[0], dateArray[1], dateArray[2]),
                        data: JSON.stringify(hrDayData)
                    });
                }
                //新添加索引
                console.log(heartRateDayCount,'新添加索引')
                if (heartRateDayCount > 0) {
                        heartRateIndex = 0
                } else {
                    heartRateIndex = Object.keys(hrDayData).length + heartRateIndex;
                }

                heartRateLastData = {
                    user_id: user.user_id,
                    y: dateArray[0],
                    m: dateArray[1],
                    d: dateArray[2],
                    time: Math.round(new Date().getTime() / 1000),
                    index: heartRateIndex
                }

                heartRateIndex = 0;
                hrDayData = new Object();
                // hrDayData = [];
                return true
            } else if (dic.data.length == 6) {
                // 判断是手动还是自动
                if (dic.data[6] == 1) {
                    return;
                }
                if (dic.data[5] == 2) {
                    heartRateIndex = (dic.data[0] * 60 + dic.data[1]) / 15;
                    hrDayData[heartRateIndex] = dic.data[3];
                    // hrDayData.push(dic.data[3]);
                }
            }
            break;
        case 'laser':


            if (dic.data.length == 1 && dic.data[0] == 4) {
                const user = app.getUser();
                if (laserDayData.length != 0) { // 如果一天的数据为空则不上传
                    let dic = {
                        user_id: user.user_id,
                        y: dateArray[0],
                        m: dateArray[1],
                        d: dateArray[2],
                        time: getTime(dateArray[0], dateArray[1], dateArray[2]),
                        data: laserDayData
                    }
                    laserData.push(dic);
                }
                // laserIndex = laserDayData.length;
                if (laserDayData.length + laserIndex >= 3) {
                    laserIndex = 0
                } else {
                    laserIndex = laserDayData.length + laserIndex;
                }
                laserLastData = {
                    user_id: user.user_id,
                    y: dateArray[0],
                    m: dateArray[1],
                    d: dateArray[2],
                    time: Math.round(new Date().getTime() / 1000),
                    index: laserIndex
                }
                laserIndex = 0;
                laserDayData = [];
                return true
            } else if (dic.data.length == 8) {
                const user = app.getUser();
                let _start_time = dic.data[0] + ":" + dic.data[1];
                let _value = dic.data[3]
                //判断是手动还是自动
                if (dic.data[7] == 1) {
                    return;
                }
                var dic = {
                    start_time: _start_time,
                    power_level: dic.data[2],
                    time: _value,
                    heartRate: dic.data[5],
                    course_sn: dic.data[7],
                    user_id: user.user_id,
                    y: dateArray[0],
                    m: dateArray[1],
                    d: dateArray[2],
                    timestamp: getTime(dateArray[0], dateArray[1], dateArray[2]),
                }
                dic[_start_time] = _value;
                console.log(dic, '上传前的心率数据')
                laserDayData.push(dic)
            }
            break;
        default:
            break;
    }
}

function getTime(year, month, day) {

    var strtime = year + '-' + month + '-' + day;
    var date = new Date(strtime);
    var date = new Date(strtime.replace(/-/g, '/'));
    return Math.round(date.getTime() / 1000)
}

/************************* 获取数据模块 **********************/

function getMovementData() {
    console.log(motionDayCount, '运动数据数量')

    if (motionDayCount >= 0) {
        dateArray = qbDate.getNewDay(-motionDayCount).split('-');
        motionDayCount -= 1;
        qbBLEManager.getMotionData(dateArray[0], dateArray[1], dateArray[2]);
    }
}

function getLaserData() {
    if (laserDayCount >= 0) {
        var index = (laserDayCount == laserTotalCount ? laserIndex : 0);
        dateArray = qbDate.getNewDay(-laserDayCount).split('-');
        laserDayCount -= 1;
        console.log(index, '从设备获取的数据的索引参数')
        console.log(dateArray, '查找的数据日期')
        qbBLEManager.getLaserData(dateArray[0], dateArray[1], dateArray[2], index);
        // qbBLEManager.getLaserData("2018", "08", "01", index);
    }
}

//获取心率监测记录
function getHRData() {

    if (heartRateDayCount >= 0) {
        var index = heartRateDayCount == heartRateTotalCount ? heartRateIndex : 0;
        dateArray = qbDate.getNewDay(-heartRateDayCount).split('-');
        heartRateDayCount -= 1;
        console.log(dateArray,index,'向设备取数据')
        qbBLEManager.getHrData(dateArray[0], dateArray[1], dateArray[2], index);
        // qbBLEManager.getHrData("2018", "08", "10", 0);
    }
}


/************************* 上传数据模块 **********************/

function uploadHeartRateData(complete, fail) {
    const dic = {
        HeartRateLastData: JSON.stringify(heartRateLastData),
        HeartRateData: heartRateData.length == 0 ? false : JSON.stringify(heartRateData),
    }
    dataService.updateHeartRateData(dic, complete, fail)
}

function uploadLaserData(complete, fail) {
    const dic = {
        laserLastData: JSON.stringify(laserLastData),
        laserData: laserData.length == 0 ? false : JSON.stringify(laserData),
    }
    console.debug("上传服务器激光数据", dic);
    dataService.updateLaserData(dic, complete, fail);
}

function uploadMovementData(complete, fail) {
    const dic = {
        movementLastData: JSON.stringify(movementLastData),
        movementData: movementData.length == 0 ? false : JSON.stringify(movementData),
    }
    console.debug("上传服务器运动数据", dic);
    dataService.updateMovementData(dic, complete, fail);
}

function clearData() {

    heartRateData = [];
    heartRateLastData = new Object();
    laserData = [];
    laserLastData = new Object();
    movementData = [];
    movementLastData = new Object();
    hrDayData = new Object();
    // hrDayData = [];
    laserDayData = [];
}

/********** 暴露的接口 ***********/
function receiveBLEData(_data, complete, fail) {
    var _body = _data.body;
    console.log(_data, '获取的数据11111')
    switch (_data.cmd) {
        case bluetoothApi.kGXYL_GetHRRecording:
            if (save({ type: 'heartRate', data: _body.data })) {
                uploadHeartRateData(function(res) {
                    clearData();
                    if (res.data.status == 1) {
                        if (heartRateDayCount < 0) {
                            res.type = 'heartRate';
                            complete(res);
                        } else {
                            getHRData();
                        }
                    } else {
                        fail();
                    }
                }, fail);
            }
            break;
        case bluetoothApi.kGXYL_GetMotionRecording:
            if (save({ type: 'motion', data: _body.data })) {
                if (motionDayCount < 0) {
                    uploadMovementData(function(res) {
                        res.type = 'movement';
                        complete(res);
                    }, fail);
                } else {
                    getMovementData();
                }
            }
            break;
        case bluetoothApi.kGXYL_GetLaserRecording:
            if (save({ type: 'laser', data: _body.data })) {
                console.log(laserDayCount, "是否要上传")
                if (laserDayCount < 0) {
                    uploadLaserData(function(res) {
                        res.type = 'laser';
                        complete(res);
                    }, fail);
                } else {
                    console.log("是否要获取")
                    getLaserData();
                }
            }
            break;
        default:
            break;
    }
}

function getDeviceData(self, dataType, complete, fail) {

    that = self;
    var deviceInfo = app.getDeviceInfo();
    if (deviceInfo.isConnect != true) {
        fail({
            status: '请先连接设备'
        });
        return;
    }
    dataService.getUserAllLastData(function(res) {
        if (res.statusCode != 200 && res.data.status != 1) {
            fail({
                status: res.data.msg ? res.data.msg : '网络出错'
            });
            return
        }

        var newDate = new Date();
        const todayDate = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();

        if (res.data.movement == null) {
            motionTotalCount = motionDayCount = 6;
        } else {
            const dayCount = qbDate.dateDiff(res.data.movement.y + '-' + res.data.movement.m + '-' + res.data.movement.d, todayDate);
            console.log(res.data.movement.y + '-' + res.data.movement.m + '-' + res.data.movement.d, '获得的天数')
            console.log(dayCount, '计算两个运动日期间的天数')
            motionTotalCount = motionDayCount = dayCount >= 7 ? 6 : dayCount;
        }

        if (res.data.laser == null) {
            laserTotalCount = laserDayCount = 6;
            laserIndex = 0;
        } else {
            laserIndex = parseInt(res.data.laser.index); //上传的索引
            const dayCount = qbDate.dateDiff(res.data.laser.y + '-' + res.data.laser.m + '-' + res.data.laser.d, todayDate); //上传的时间之间的天数
            // const dayCount = qbDate.dateDiff("2018-07-28", todayDate);//上传的时间之间的天数
            console.log(dayCount, '计算两个激光日期间的天数')
            laserTotalCount = laserDayCount = dayCount >= 7 ? 6 : dayCount; //只存储临近一周的数据
        }

        if (res.data.heart_rate == null) {
            heartRateTotalCount = heartRateDayCount = 6;
            heartRateIndex = 0;
        } else {
            heartRateIndex = parseInt(res.data.heart_rate.index) || 0;
            const dayCount = qbDate.dateDiff(res.data.heart_rate.y + '-' + res.data.heart_rate.m + '-' + res.data.heart_rate.d, todayDate);
             console.log(dayCount, '计算两个心率日期间的天数')
            heartRateTotalCount = heartRateDayCount = dayCount >= 7 ? 6 : dayCount;
        }

        wx.showLoading({
            title: '',
            mask: false
        })
        switch (dataType) {
            case 'movement':
                self.setData({
                    updateStatus: '正在上传运动数据，请耐心等待！'
                })
                getMovementData();
                homeBluetooth.onBLE(self, {
                    receiveMessageCallBack: function(res) {
                        receiveBLEData(res, function(res) {
                            console.debug('上传运动数据:', res);
                            wx.hideLoading();
                            clearData();
                            (res.statusCode == 200 && res.data.status == 1) ? complete(): fail({ status: '上传运动数据失败' });
                        }, function(err) {
                            wx.hideLoading();
                            clearData();
                            fail({ status: '上传运动数据失败' })
                        });
                    }
                })
                break;
            case 'laser':
                self.setData({
                    updateStatus: '正在上传激光数据，请耐心等待！'
                })
                getLaserData();
                homeBluetooth.onBLE(self, {
                    receiveMessageCallBack: function(res) {
                        receiveBLEData(res, function(res) {
                            console.debug('上传激光数据:', res);
                            wx.hideLoading();
                            clearData();
                            (res.statusCode == 200 && res.data.status == 1) ? complete(): fail({ status: '上传激光数据失败' });
                        }, function(err) {
                            wx.hideLoading();
                            clearData();
                            fail({ status: '上传激光数据失败' })
                        });
                    }
                })
                break;
            case 'heartRate':
                self.setData({
                    updateStatus: '正在上传心率数据，请耐心等待！'
                })
                getHRData();
                homeBluetooth.onBLE(self, {
                    receiveMessageCallBack: function(res) {
                        receiveBLEData(res, function(res) {
                            wx.hideLoading();
                            (res.statusCode == 200 && res.data.status == 1) ? complete(): fail({ status: '上传心率数据失败' });
                        }, function(err) {
                            wx.hideLoading();
                            clearData();
                            fail({ status: '上传心率数据失败' })
                        });
                    }
                })
                break;
            case 'allData':
                var firmwareVersion = wx.getStorageSync('firmwareVersion') || '';
                if (firmwareVersion < 'V1.6.10') {
                    console.log(firmwareVersion)
                    self.setData({
                        updateStatus: '请先升级固件再上传'
                    })
                    wx.hideLoading();
                    return;
                }
                self.setData({
                    updateStatus: '正在上传运动数据，请耐心等待！'
                })
                getMovementData();
                homeBluetooth.onBLE(self, {
                    receiveMessageCallBack: function(res) {
                        receiveBLEData(res, function(res) {
                            console.log(res, '上传的数据')

                            clearData();
                            switch (res.type) {
                                case 'movement':
                                    if (res.statusCode == 200 && res.data.status == 1) {
                                        self.setData({
                                            updateStatus: '正在上传激光数据，请耐心等待！'
                                        })
                                        getLaserData();
                                    } else {
                                        wx.hideLoading();
                                        fail({ status: '上传运动数据失败' });
                                    }
                                    break;
                                case 'laser':
                                    if (res.statusCode == 200 && res.data.status == 1) {
                                        self.setData({
                                            updateStatus: '正在上传心率数据，请耐心等待！'
                                        })
                                        getHRData();
                                    } else {
                                        wx.hideLoading();
                                        fail({ status: '上传激光数据失败' });
                                    }
                                    break;
                                case 'heartRate':
                                    if (res.statusCode == 200 && res.data.status == 1) {
                                        wx.hideLoading();
                                        complete();
                                    } else {
                                        wx.hideLoading();
                                        fail({ status: '上传心率数据失败' });
                                    }
                                    break;
                                default:
                                    return;
                            }
                        }, function(err) {
                            wx.hideLoading();
                            clearData();
                            fail({ status: '上传数据失败' })
                        });
                    }
                })
                break;
            default:
                return;
        }

    }, function(err) {
        wx.showToast({
            icon: 'none',
            title: '网络出错',
        });
        fail({
            status: '获取数据初始化失败'
        });
    })
}

function onBLE(complete, fail) {

    var self = this;
    homeBluetooth.onBLE(self, {
        receiveMessageCallBack: function(res) {

            receiveBLEData(res, complete, fail);
        }
    })
}


module.exports = {
    getDeviceData: getDeviceData
}