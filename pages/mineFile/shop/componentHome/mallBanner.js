
var mallApi = require('../../../../common/newService/mallService');
var app = getApp();

var swiperImageUrlArray = new Array();

function initBanner(self) {

  if (swiperImageUrlArray.length != 0 || swiperImageUrlArray != undefined) {
    swiperImageUrlArray = [];
  }

  mallApi.getShopBannerImages(function (res) {
    res.data.img_list.forEach(function (v, index) {

      let bannerObject = {
        "swiperSrc": "swiperSrc" + index,
        "data": v.goods_img_url
      }
      swiperImageUrlArray.push(bannerObject);
    })
    self.setData({
      imageUrls: swiperImageUrlArray
    })
  }, function (err) {
    console.log(err);
  })
}

module.exports = {
    initBanner: initBanner,
}