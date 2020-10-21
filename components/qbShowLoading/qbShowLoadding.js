

function qbShowLoading(isShow, title) {
  if (isShow == true && title != undefined) {
    wx.showLoading({
      title: title,
      mask: true,
      success: function (res) {

        setTimeout(function () {
          wx.hideLoading();
        }, 300000);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  } else {
    wx.hideLoading();
  }
}

module.exports = {
  qbShowLoading: qbShowLoading
}