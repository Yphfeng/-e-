var qbService = require('service');

function getUserQRCode(complete, fail) {

    var app = getApp();
    let user = app.getUser();
    qbService.request({
        path: "Weixin/Weixin/getWeixinQrcode",
        data: {},
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}
//判断是否绑定了手机号
function isBindPhone(complete, fail) {
    qbService.request({
        path: 'Weixin/UserBindPhone/isBindPhone',
        data: {},
        method: 'POST',
    }, function(res) {
        complete(res)
    }, function(err) {
        fail(err)
    })
}
//发送验证码
function sendRegVerify(data, complete, fail) {
    qbService.request({
        path: 'Weixin/UserBindPhone/sendRegVerify',
        data: data,
        method: 'POST',
    }, function(res) {
        complete(res)
    }, function(err) {
        fail(err)
    })
}
//判断验证码是否正确
function getRegVerify(data, complete, fail) {
    qbService.request({
        path: 'Weixin/UserBindPhone/getRegVerify',
        data: data,
        method: 'POST',
    }, function(res) {
        complete(res)
    }, function(err) {
        fail(err)
    })
}
//绑定手机号
function bindPhone(data, complete, fail) {
    qbService.request({
        path: 'Weixin/UserBindPhone/bindPhone',
        data: data,
        method: 'POST',
    }, function(res) {
        complete(res)
    }, function(err) {
        fail(err)
    })
}
//保存用户微信用户信息
function saveUserinfo(data, complete, fail) {
    qbService.request({
        path: 'Weixin/UserBindPhone/saveUserinfo',
        data: data,
        method: 'POST',
    }, function(res) {
        complete(res)
    }, function(err) {
        fail(err)
    })
}

//判断商城是否开启关闭
function getShopStatus(complete, fail) {
    qbService.request({
        path: 'Weixin/User/getShopStatus',
        data: {},
        method: 'POST',
    }, function(res) {
        complete(res)
    }, function(err) {
        fail(err)
    })
}
//申请成为健康大使
function applyHealthAmbassador(complete, fail) {
    qbService.request({
        path: 'Weixin/HealthAmbassador/applyHealthAmbassador',
        data: {},
        method: 'POST',
    }, function(res) {
        complete(res)
    }, function(err) {
        fail(err)
    })
}
//判断是否为健康大使
function isAmbassador(complete, fail) {
    qbService.request({
        path: 'Weixin/HealthAmbassador/isAmbassador',
        data: {},
        method: 'POST',
    }, function(res) {
        complete(res)
    }, function(err) {
        fail(err)
    })
}
//获取退货信息
function returnGoodsInfo(data, complete, fail) {
    qbService.request({
        path: 'Weixin/ReturnGoods/returnGoodsInfo',
        data: data,
        method: 'POST',
    }, function(res) {
        complete(res)
    }, function(err) {
        fail(err)
    })
}
//获取物流信息
function getOrderTraces(data, complete, fail) {
    qbService.request({
        path: 'Weixin/ShopUserOrder/getLogisticsInfo',
        data: data,
        method: 'POST',
    }, function(res) {
        complete(res)
    }, function(err) {
        fail(err)
    })
}
//最后一次连接设备的绑定时间
function lastConnectTime(data,complete, fail) {
    qbService.request({
        path: 'Weixin/UserConnectionDevice/lastConnectTime',
        data: data,
        method: 'POST',
    }, function(res) {
        complete(res)
    }, function(err) {
        fail(err)
    })
}

function bindingDevice(deviceId, complete, fail) {
    console.log(deviceId);
    qbService.request({
        path: "Weixin/Device/bindDevice",
        data: {
            device_sn: deviceId,
        },
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

function getUserDeviceList(complete, fail) {
    qbService.request({
        path: 'Weixin/Device/getUserDeviceList',
        data: {},
        method: 'POST'
    }, complete, fail);
}

function unbindDevice(complete, fail) {
    qbService.request({
        path: 'Weixin/Device/unbindDevice',
        data: {},
        method: 'POST'
    }, complete, fail)
}
//获取疗程参数列表
function getCourseInfoList(complete, fail) {
    qbService.request({
        path: 'Weixin/Course/getCourseInfoList',
        data: {},
        method: 'post',
    }, complete, fail)
}
//获取疗程参数详情
function getCourseParameter(data, complete, fail) {
    qbService.request({
        path: 'Weixin/Course/getCourseParameter',
        data: data,
        method: 'post',
    }, complete, fail)
}
//获取设备类型及参数
function getDeviceType(complete, fail) {
    qbService.request({
        path: 'Weixin/IeaseDevice/getDeviceType',
        data: {},
        method: 'post',
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}
//设置租赁设备疗程
function setIeaseDeviceCourse(data, complete, fail) {
    qbService.request({
        path: 'Weixin/IeaseDevice/setIeaseDeviceCourse',
        data: data,
        method: 'post',
    }, complete, fail)
}

function getUserSignStatus(complete, fail) {
    qbService.request({
        path: "Weixin/Sign/getUserSignStatus",
        data: {},
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

function createUserSign(complete, fail) {

    qbService.request({
        path: "Weixin/Sign/userSign",
        data: {},
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

function getUserHaveOrNotDevices(complete, fail) {

    qbService.request({
        path: 'Weixin/User/getUserDevice',
        data: {},
        method: 'POST',
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

function getUserPoints(complete, fail) {

    qbService.request({
        path: 'Weixin/UserPoint/getUserPoints',
        data: {},
        method: 'POST'
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

/**
 * UserSalesman/getSalesmanUser
Status
 */
function getSalesmanUserStatus(complete, fail) {
    qbService.request({
        path: 'Weixin/UserSalesman/getSalesmanUserStatus',
        data: {},
        method: 'POST'
    }, complete, fail)
}

/**
 * 获取余额
 */
function getUserBalance(complete, fail) {

    qbService.request({
        path: 'Weixin/User/getUserMoney',
        data: {},
        method: 'POST'
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

function getUserName(complete, fail) {

    qbService.request({
        path: 'Weixin/User/getUserName',
        data: {},
        method: 'POST'
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

function getUserDeviceInfo(complete, fail) {

    qbService.request({
        path: 'Weixin/Device/getUserDeviceInfo',
        data: {},
        method: 'POST'
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

function getUserInfo(complete, fail) {

    qbService.request({
        path: 'Weixin/User/getUserInfo',
        data: {},
        method: 'POST'
    }, complete, fail);
}

function updateUserInfo(data, complete, fail) {

    qbService.request({
        path: 'Weixin/User/updateUserInfo',
        data: data,
        method: 'POST'
    }, complete, fail);
}

function getUserDeviceEBi(complete, fail) {

    qbService.request({
        path: 'Weixin/User/getUserDeviceEb',
        data: {},
        method: 'POST'
    }, complete, fail);
}

function updateUserDeviceEBi(eBi, complete, fail) {

    qbService.request({
        path: 'Weixin/User/updateUserDeviceEb',
        data: {
            eb: eBi
        },
        method: 'POST'
    }, complete, fail)
}

function getUserPointLogList(data, complete, fail) {

    qbService.request({
        path: 'Weixin/UserPoint/getUserPointLogList',
        data: data,
        method: 'POST',
    }, complete, fail);
}

function toShareData(complete, fail) {

    qbService.request({
        path: 'Weixin/UserData/addUserShareData',
        data: {},
        method: 'POST'
    }, complete, fail);
}

function getInterestList(complete, fail) {
    qbService.request({
        path: 'Weixin/User/gitInterestList',
        data: {},
        method: 'POST'
    }, complete, fail);
}

function getMedicalList(complete, fail) {
    qbService.request({
        path: 'Weixin/User/gitDiseaseList',
        data: {},
        method: 'POST'
    }, complete, fail);
}

function createOpenId(complete, fail) {

    wx.login({
        success: function(res) {
            console.debug("map_code", res.code);
            qbService.request({
                path: 'Weixin/User/addUserWxOpenId',
                data: {
                    code: res.code
                },
                method: 'POST'
            }, complete, fail);
        },
        fail: function(res) {},
        complete: function(res) {},
    })
}

module.exports = {
    getUserQRCode: getUserQRCode,
    bindingDevice: bindingDevice,
    unbindDevice: unbindDevice,
    getUserSignStatus: getUserSignStatus,
    createUserSign: createUserSign,
    getUserHaveOrNotDevices: getUserHaveOrNotDevices,
    getUserPoints: getUserPoints,
    getUserBalance: getUserBalance,
    getUserName: getUserName,
    getUserDeviceInfo: getUserDeviceInfo,
    getUserInfo: getUserInfo,
    updateUserInfo: updateUserInfo,
    getUserDeviceEBi: getUserDeviceEBi,
    updateUserDeviceEBi: updateUserDeviceEBi,
    getUserPointLogList: getUserPointLogList,
    toShareData: toShareData,
    getInterestList: getInterestList,
    getMedicalList: getMedicalList,
    createOpenId: createOpenId,
    getUserDeviceList: getUserDeviceList,
    getSalesmanUserStatus: getSalesmanUserStatus,
    getDeviceType: getDeviceType,
    setIeaseDeviceCourse: setIeaseDeviceCourse,
    getCourseInfoList: getCourseInfoList,
    getCourseParameter: getCourseParameter,
    getShopStatus: getShopStatus,
    isBindPhone: isBindPhone,
    sendRegVerify: sendRegVerify,
    getRegVerify: getRegVerify,
    bindPhone: bindPhone,
    applyHealthAmbassador: applyHealthAmbassador,
    isAmbassador: isAmbassador,
    returnGoodsInfo: returnGoodsInfo,
    getOrderTraces: getOrderTraces,
    saveUserinfo: saveUserinfo,
    lastConnectTime: lastConnectTime
}