const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//api域名
const domain = () => {
  //  return "http://192.168.1.125:8080";
  return "https://www.sharemedical.cn/";
}
function isSuccess(rst) {
  return rst.status == "success";
}
const imageDomain = () => {
  return "https://static.eastonsoft.com/business";
}

function getShareInfo(title){
  if(!title){
    var setting = wx.getStorageSync("setting");
    title = setting.clubName;
  }
  title = title || '转发';
  return {
    title: title,
    path: '/pages/index/index'};
}

function ajax(param) {
  var lock = wx.getStorageSync(param.url);
  if (lock) {
    console.log("请求太频繁:" + param.url);
    setTimeout(function () {
      wx.setStorageSync(param.url, false);
    }, 2000);
    return;
  }
  wx.setStorageSync(param.url, true);
  var header = {};
  if (!param.method) {
    param.method = "post";
  }
  if (param.header) {
    header = param.header;
    header['Cookie'] = getApp().globalData.header["Cookie"];
  } else {
    header = getApp().globalData.header;
  }
  wx.request({
    url: domain() + param.url,
    method: param.method,
    data: param.data,
    header: header,
    complete: param.complete,
    success: function (rst) {
      wx.setStorageSync(param.url, false);
      //本地保存的sessionid和服务器返回的不一致，下次请求使用服务器返回的sessionid
      if (rst.header && rst.header["Set-Cookie"] && getApp().globalData.header["Cookie"] != rst.header["Set-Cookie"]) {
        getApp().globalData.header["Cookie"] = rst.header["Set-Cookie"];
      }
      //后台提示未登录
      if (!isSuccess(rst.data) && rst.data.code == '401') {
        wx.setStorageSync("account", null);
        wx.redirectTo({
          url: '/pages/logIn/logIn?login=true'
        })
        return;
      }
      if (param.success) {
        param.success(rst);
      }
    }, error: function (error) {
      console.log("error", rst);
      wx.showToast({
        title: '无法连接到服务器',
        icon: "none"
      })
    }
  })
}
module.exports = {
  formatTime: formatTime,
  ajax: ajax,
  domain: domain,
  isSuccess: isSuccess,
  imageDomain: imageDomain,
  getShareInfo: getShareInfo
}
