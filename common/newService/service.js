

function request(dic, completed, error) {

  const app = getApp();
  const user = app.getUser();
  
  dic.data.armariumScienceSession = user.token;
  if (wx.getStorageSync("ajaxSuccess")==1){
    return;
  }
  if (!user.token){
    // app.globalData.ajaxSuccess = 1;
    wx.setStorageSync("ajaxSuccess", 1)
    wx.redirectTo({
      url: '/pages/home/home'
    })
    
    return;
  }
  wx.request({
    url: app.urlPrefix + dic.path,
    method: dic.method,
    data: dic.data,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(res);
      if(res.data.msg == "非法登录"){
        
        wx.setStorageSync("ajaxSuccess", 1)
        
        wx.redirectTo({
          url: '/pages/home/home'
        })
        
        return;
      }
      completed(res);
      // if (res.data.token_status == 0) {
      //   wx.reLaunch({
      //     url: '../../pages/login/login?token=false',
      //   })
      // } else {
      //   completed(res);
      // }
    },
    fail: function (res) {
      if (res.msg == "非法登录") {
        wx.redirectTo({
          url: '/pages/home/home'
        })
        return;
      }
      error(res);
    }
  });
}
module.exports = {
  request: request
}