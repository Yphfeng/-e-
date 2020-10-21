var tallApi = require('../../../common/serviceAPI/tallServiceApi');

var tempalteArray = [];
var latestChatId = 0;

/**
 * 加载聊天记录
 */
function loadChatConten(self, chatToUserId) {

    // 获取聊天记录，显示
    // armariumZuoYou: 1左边，2右边
    if (chatToUserId == undefined) { console.log("chatToUserId is undefined"); return; }
    tallApi.chat_getMessage(chatToUserId, 0, function (res) {

        if (res.data.data.length == 0)
            return

        var chatCatchs = res.data.data.reverse();
        for (var i = 0; i < chatCatchs.length; i++) {

            if (parseInt(chatCatchs[i].armariumScienceUserLtId) > latestChatId) {

                for (var j = i; j < chatCatchs.length; j++) {
                    // 如果获取回来的数据的聊天Id == 缓存的聊天Id，直接break，不将聊天数据添加到界面中
                    // 将聊天数据添加到界面中
                    let item = {
                        "unique": "unique" + j,
                        "data": {
                            "isSelf": chatCatchs[j].armariumZuoYou == "1" ? true : false,
                            "message": chatCatchs[j].armariumLt,
                            "src": "../../../images/ebi@3x.png"
                        }
                    }
                    tempalteArray.push(item);

                    // 保存最新的聊天Id
                    latestChatId = parseInt(chatCatchs[i].armariumScienceUserLtId);
                }
                self.setData({
                    templates: tempalteArray
                })
                break;
            }
        }
    }, function (err) { });
}

function loadChatContentRegularly(self, chatToUserId) {

    // 每3秒钟取一次数据
    setInterval( () => {
        if (chatToUserId == undefined) { console.log("chatToUserId is undefined"); return; }
        tallApi.chat_getMessage(chatToUserId, 0, function (res) {

            if (res.data.data.length == 0)
                return

            var chatCatchs = res.data.data.reverse();
            for (var i = 0; i < chatCatchs.length; i++) {

                if (parseInt(chatCatchs[i].armariumScienceUserLtId) > latestChatId) {

                    for (var j = i; j < chatCatchs.length; j++) {
                        // 如果获取回来的数据的聊天Id == 缓存的聊天Id，直接break，不将聊天数据添加到界面中
                        // 将聊天数据添加到界面中
                        let item = {
                            "unique": "unique" + j,
                            "data": {
                                "isSelf": chatCatchs[j].armariumZuoYou == "1" ? true : false,
                                "message": chatCatchs[j].armariumLt,
                                "src": "../../images/ebi@3x.png"
                            }
                        }
                        tempalteArray.push(item);

                        // 保存最新的聊天Id
                        latestChatId = parseInt(chatCatchs[i].armariumScienceUserLtId);
                    }
                    self.setData({
                        templates: tempalteArray
                    })
                    break;
                }
            }

        }, function (err) { });
    } , 3000);
}

/**
 * 发送消息
 */
function sendMessage(message, self, chatToUserId) {

    if (chatToUserId == undefined) { console.log("chatToUserId is undefined"); return; }
    tallApi.chat_sendMessage(chatToUserId, message, function (res) {

        if (res.data.return == "1") {
            let item =
                {
                    "unique": "unique" + tempalteArray.length,
                    "data": {
                        "isSelf": true,
                        "message": message,
                        "src": "../../images/ebi@3x.png"
                    }
                };
            tempalteArray.push(item);
            self.setData({
                templates: tempalteArray,
                inputValue: ""
            });
        }
    }, function (err) { })
}

module.exports = {
    loadChatConten: loadChatConten,
    sendMessage: sendMessage,
    loadChatContentRegularly: loadChatContentRegularly
}