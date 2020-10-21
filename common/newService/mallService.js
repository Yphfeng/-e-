var qbService = require('service');

function getShopBannerImages(complete, fail) {

    qbService.request({
        path: "Weixin/ShopView/getShopHeadImg",
        data: {

        },
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}
// 获取商品分类
function getGoodsType(complete, fail) {
    qbService.request({
        path: "Weixin/ShopView/getGoodsType",
        data: {},
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}
//获取商品分类标签
function getGoodsTypeLabel(id, complete, fail) {
    qbService.request({
        path: "Weixin/ShopView/getGoodsTypeLabel",
        data: {
            shop_type_id: id
        },
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}
//确认收货
function confirmReceipt(data, complete, fail) {
    qbService.request({
        path: "Weixin/ShopUserOrder/confirmReceipt",
        data: data,
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

function getShopGoodsList(complete, fail) {

    qbService.request({
        path: "Weixin/ShopView/getGoodsHomeList",
        data: {},
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

function getGoodsDetail(goodId, complete, fail) {

    qbService.request({
        path: "Weixin/ShopView/getGoodsDetail",
        data: {
            goods_id: goodId
        },
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}
//列表数据
function getGoodsTypeList(id, complete, fail) {

    qbService.request({
        path: "Weixin/ShopView/getGoodsTypeList",
        data: {
            shop_type_id: id
        },
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

function addShoppingCart(data, complete, fail) {

    qbService.request({
        path: "Weixin/Shop/addCart",
        data: data,
        method: "POST"
    }, complete, fail);
}

function getShoppingCart(complete, fail) {

    qbService.request({
        path: "Weixin/Shop/cartList",
        data: {},
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        complete(err)
    })
}

function allSelecteGoodsOfShoppingCar(isAllSelecte, complete, fail) {

    qbService.request({
        path: "Weixin/Shop/selectAllCartGoods",
        data: {
            status: isAllSelecte ? '1' : '0'
        },
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        complete(err)
    })
}

function seleteGoodsOfShoppingCart(dic, complete, fail) {

    qbService.request({
        path: "Weixin/Shop/selectedCartGoods",
        data: {
            cart_id: dic.cart_id,
            status: dic.status
        },
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        complete(err)
    })
}

function delegateGoodsOfShoppingCart(cartGoodsId, complete, fail) {

    qbService.request({
        path: "Weixin/Shop/deleCartGoods",
        data: {
            cart_id: cartGoodsId
        },
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        complete(err)
    })
}

function addGoodsNumOfShoppingCart(cartGoodsId, complete, fail) {

    qbService.request({
        path: "Weixin/Shop/addCartGoodsNum",
        data: {
            cart_id: cartGoodsId
        },
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        complete(err)
    })
}

function reduceGoodsOfShoppingCart(cartGoodsId, complete, fail) {

    qbService.request({
        path: "Weixin/Shop/reduceCartGoodsNum",
        data: {
            cart_id: cartGoodsId
        },
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        complete(err)
    })
}

function submintedOrder(data, complete, fail) {

    qbService.request({
        path: "Weixin/Shop/submitOrder",
        data: data,
        method: "POST"
    }, complete, fail)
}

function createOrder(data, complete, fail) {

    qbService.request({
        path: "Weixin/Shop/createOrder",
        data: data,
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

function getOrderPrice(dic, complete, fail) {

    qbService.request({
        path: 'Weixin/Shop/getOrderMoney',
        data: {
            use_points_status: dic.isUsePoints ? '1' : '0',
            use_money_status: dic.isUseBalance ? '1' : '0',
            order_type: dic.orderType
        },
        method: 'POST'
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

function wxpaymentSuccess(dic, complete, fail) {

    qbService.request({
        path: "Weixin/Shop/paymentCallback",
        data: {
            order_id: dic.orderId,
            order_payment_status: dic.status
        },
        method: "POST"
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}

function wxpaymentSuccessOfDeposit(complete, fail) {

    qbService.request({
        path: 'Weixin/User/updateUserDeposit',
        data: {},
        method: 'POST'
    }, function(res) {
        complete(res);
    }, function(err) {
        fail(err);
    })
}
//获取订单列表
function getOrderList(data, complete, fail) {
    var id = Number(data.key) || 0;
    switch (id) {
        case 0:
            qbService.request({
                path: 'Weixin/ShopUserOrder/getUserUnpaidOrderList',
                data: data,
                method: 'POST'
            }, complete, fail);
            break;
        case 1:
            qbService.request({
                path: 'Weixin/ShopUserOrder/getUserNotDeliveredOrderList',
                data: data,
                method: 'POST'
            }, complete, fail);
            break;
        case 2:
            qbService.request({
                path: 'Weixin/ShopUserOrder/getUserDeliveredOrderList',
                data: data,
                method: 'POST'
            }, complete, fail);
            break;
        case 3:
            qbService.request({
                path: 'Weixin/ShopUserOrder/getUserFinishOrderList',
                data: data,
                method: 'POST'
            }, complete, fail);
            break;
        default:
            qbService.request({
                path: 'Weixin/ShopUserOrder/getUserOrderReturnList',
                data: data,
                method: 'POST'
            }, complete, fail);
            break;
    }
}
//退订单
function returnOrder(data, complete, fail) {
    qbService.request({
        path: 'Weixin/ReturnGoods/returnOrder',
        data: data,
        method: 'POST'
    }, complete, fail);
}
//待收货中退订单
function returnOrderForReturn(data,complete,fail){
qbService.request({
        path: 'Weixin/ReturnGoods/returnOrderForReturn',
        data: data,
        method: 'POST'
    }, complete, fail);
}
//退商品
function applicationForReturn(data, complete, fail) {
    qbService.request({
        path: 'Weixin/ReturnGoods/applicationForReturn',
        data: data,
        method: 'POST'
    }, complete, fail);
}
//获取订单详情
function getUserDeliveredOrderDetail(data, complete, fail) {
    qbService.request({
        path: 'Weixin/ShopUserOrder/getUserDeliveredOrderDetail',
        data: data,
        method: 'POST'
    }, complete, fail);
}

function cancePendingPaymentOrder(orderId, complete, fail) {
    qbService.request({
        path: 'Weixin/ShopUserOrder/closeUserOrder',
        data: {
            order_id: orderId
        },
        method: 'POST'
    }, complete, fail);
}

function delegateOrder(orderId, complete, fail) {
    qbService.request({
        path: 'Weixin/User/cancelUserOrder',
        data: {
            order_id: orderId
        },
        method: 'POST'
    }, complete, fail);
}

module.exports = {

    getShopBannerImages: getShopBannerImages,
    getShopGoodsList: getShopGoodsList,

    getGoodsDetail: getGoodsDetail,
    addShoppingCart: addShoppingCart,
    getShoppingCart: getShoppingCart,
    allSelecteGoodsOfShoppingCar: allSelecteGoodsOfShoppingCar,
    seleteGoodsOfShoppingCart: seleteGoodsOfShoppingCart,
    delegateGoodsOfShoppingCart: delegateGoodsOfShoppingCart,
    addGoodsNumOfShoppingCart: addGoodsNumOfShoppingCart,
    reduceGoodsOfShoppingCart: reduceGoodsOfShoppingCart,

    submintedOrder: submintedOrder,
    createOrder: createOrder,
    getOrderPrice: getOrderPrice,

    wxpaymentSuccess: wxpaymentSuccess,
    wxpaymentSuccessOfDeposit: wxpaymentSuccessOfDeposit,

    getOrderList: getOrderList,
    cancePendingPaymentOrder: cancePendingPaymentOrder,
    delegateOrder: delegateOrder,
    getGoodsType: getGoodsType,
    getGoodsTypeLabel: getGoodsTypeLabel,
    getGoodsTypeList: getGoodsTypeList,
    getUserDeliveredOrderDetail: getUserDeliveredOrderDetail,
    returnOrder: returnOrder,
    applicationForReturn: applicationForReturn,
    confirmReceipt: confirmReceipt,
    returnOrderForReturn: returnOrderForReturn
}