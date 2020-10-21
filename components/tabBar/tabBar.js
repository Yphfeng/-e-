//初始化数据
function tabbarinit() {
 return [
      { "current":0,
        "pagePath": "/pages/mineFile/shop/componentHome/shopHome",
        "text": "商城"
      },
      {
        "current": 0,
        "pagePath": "/pages/mineFile/shop/componentCart/shopCart",
        "text": "购物车"

      },
      {
        "current": 0,
        "pagePath": "/pages/mineFile/shop/componentOrder/shopOrder",
        "text": "订单"
      }
    ]

}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({
    bindData: bindData
  });
}

module.exports = {
  tabbar: tabbarmain
}