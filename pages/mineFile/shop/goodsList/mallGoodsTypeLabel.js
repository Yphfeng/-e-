
var mallApi = require('../../../../common/newService/mallService');
var app = getApp();

var goodsTypeLabel = new Array();

function initGoodsTypeLabel(id,self) {

  if (initGoodsTypeLabel.length != 0 || initGoodsTypeLabel != undefined) {
    goodsTypeLabel = [];
  }

  mallApi.getGoodsTypeLabel(id,function (res) {
    if (res.data.type_label != null && res.data.type_label.length > 0) {
      res.data.type_label.unshift({ label_id: "0", label_position: "0", shop_type_id: "8", label_name: "全部" });
      self.setData({
        navData: res.data.type_label
      })
    }else{
      self.setData({
        navData: [{ label_id: "0", label_position: "0", shop_type_id: "8", label_name: "全部" }]
      })
    }
    
  }, function (err) {
    console.log(err);
  })
}

module.exports = {
  initGoodsTypeLabel: initGoodsTypeLabel
}