
var mallApi = require('../../../../common/newService/mallService');
var app = getApp();

var goodsType = new Array();

function initGoodsType(self) {

  if (goodsType.length != 0 || goodsType != undefined) {
    goodsType = [];
  }

  mallApi.getGoodsType(function (res) {
    if (res.data.shop_type && res.data.shop_type.length > 5 ){
      var type_1 = res.data.shop_type.slice(0,5);
      var type_2 = res.data.shop_type.slice(5, Number(res.data.shop_type.length)+1);
      self.setData({
        navContents1: type_1,
        navContents2: type_2
      })
    }else{
      self.setData({
        navContents1: res.data.shop_type,
        navContents2: []
      })
    }
  }, function (err) {
    console.log(err);
  })
}

module.exports = {
  initGoodsType: initGoodsType,
}