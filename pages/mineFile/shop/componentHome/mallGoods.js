// 模拟数据
var mallApi = require('../../../../common/newService/mallService');
var app = getApp();
var goodsArrayUI = new Array();
var goodsData = new Array();

function initGoods(self) {

  if (goodsArrayUI.length != 0 || goodsArrayUI != undefined) {
    goodsArrayUI = [];
  }

  mallApi.getShopGoodsList(function (res) {
    
    if (res.status == "0") {
      self.setData({
        goodsItem: goodsArrayUI
      })
      return;
    }
    goodsData = res.data.goods_list;
    goodsData.forEach(function (v, index) {

      var subTitle = v.point == "0" ? "" : "抵扣积分";
      let goodObject = {
        id: v.id,
        goodsImageSrc: v.goods_img,
        money: v.goods_price,
        mainTitle: v.goods_name,
        subTitle: subTitle,
        actionIndex: index,
        points: v.point
      }
      goodsArrayUI.push(goodObject);
    })
    self.setData({
      goodsItem: goodsArrayUI,
    })
  }, function (err) {
    console.log(err);
  })
}
function initTypeGoods(id,self) {
  if (goodsArrayUI.length != 0 || goodsArrayUI != undefined) {
    goodsArrayUI = [];
  }

  mallApi.getGoodsTypeList(id,function (res) {

    if (res.status == "0") {
      self.setData({
        goodsItem: goodsArrayUI
      })
      return;
    }
    goodsData = res.data.goods_list;
    goodsData.forEach(function (v, index) {

      var subTitle = v.point == "0" ? "" : "可用积分";
      let goodObject = {
        id: v.id,
        goodsImageSrc: v.goods_img,
        money: v.goods_price,
        mainTitle: v.goods_name,
        subTitle: subTitle,
        actionIndex: index
      }
      goodsArrayUI.push(goodObject);
    })
    self.setData({
      goodsItem: goodsArrayUI,
    })
  }, function (err) {
    console.log(err);
  })
}

module.exports = {
  initGoods: initGoods,
  initTypeGoods: initTypeGoods
}