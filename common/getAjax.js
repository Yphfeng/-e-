
function getPost(url, params) {
  const app = getApp();
  var urlParam = app.urlWWW + url;
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: urlParam,
      data: params,
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.msg == "非法登录") {

          wx.setStorageSync("ajaxSuccess", 1)

          wx.redirectTo({
            url: '/pages/home/home'
          })

          return;
        }
        if (res.data.status == 1) {
          resolve(res);
        } else {
          reject(res)
        }

      }
    })
  });
  return promise
}
module.exports = {
  getPost: getPost
}