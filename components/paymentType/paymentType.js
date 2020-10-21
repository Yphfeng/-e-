

function paymentObject(minusIntegral, minusMoney, title, price) {
  let totalMessage = new Object();
  totalMessage.minusIntegral = minusIntegral;
  totalMessage.minusMoney = minusMoney;
  totalMessage.title = title;
  totalMessage.price = price;
  return totalMessage;
}

function judgePaymentTypeOfIntegralAndBalance(userWallet, commodityWallet) {

  var userIntegral = userWallet.integral;
  var userMoney = userWallet.money;
  var comIntegral = commodityWallet.integral;
  var comMoney = commodityWallet.money;

  if (userIntegral + "" >= comIntegral + "" && userIntegral != 0.00) {
    return paymentObject(comIntegral, 0, "积分支付", comIntegral);
  } else {
    if (userMoney + "" >= comMoney + "" && userMoney != 0.00) {
      return paymentObject(userIntegral, comIntegral - userIntegral, "余额和积分支付", comMoney);
    } else {
      return paymentObject(userIntegral, userMoney, "微信支付", comMoney - userIntegral - userMoney);
    }
  }
}

function judgePaymentTypeOfIntegral(userWallet, commodityWallet) {

  var userIntegral = userWallet.integral;
  var userMoney = userWallet.money;
  var comIntegral = commodityWallet.integral;
  var comMoney = commodityWallet.money;

  if (userIntegral < comIntegral) {

    return paymentObject(userIntegral, 0, "微信支付", comIntegral - userIntegral);

  } else {
    return paymentObject(comIntegral, 0, "积分支付", comIntegral);
  }
}

/**
 * 判断余额支付方
 */
function judgePaymentTypeOfBalance(userWallet, commodityWallet) {

  var userIntegral = userWallet.integral;
  var userMoney = userWallet.money;
  var comIntegral = commodityWallet.integral;
  var comMoney = commodityWallet.money;
  // 2.1用户余额不足的情况下
  if (userMoney < comMoney) {

    return paymentObject(0, userMoney, "微信支付", comMoney - userMoney);
    // 2.2用户余额充足的情况下
  } else {
    return paymentObject(0, comMoney, "余额支付", comMoney);
  }
}

/**
 * 计算总价
 * 选中的支付类型[balance, integral]，
 * 用户钱包{balance: , integral: }, 
 * 商品钱包{balance: , integral: }
 * 返回一个对象
 */
function optrationTotalPrice(paymentTypes, userWallet, commodityWallet) {

  // 根据用户选择的支付方式进行判断
  switch (paymentTypes.length) {
    case 2:
      return judgePaymentTypeOfIntegralAndBalance(userWallet, commodityWallet)
      break;
    case 1:
      if (paymentTypes[0] == 'balance') {
        return judgePaymentTypeOfBalance(userWallet, commodityWallet);
      }
      if (paymentTypes[0] == 'integral') {
        return judgePaymentTypeOfIntegral(userWallet, commodityWallet);
      }
      break;
    case 0:
      return paymentObject(0, 0, "微信支付", commodityWallet.money);
      break;
    default:
      break;
  }
}

module.exports = {
  optrationTotalPrice: optrationTotalPrice
}
