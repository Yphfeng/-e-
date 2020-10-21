// var tallApi = require('../../../common/serviceAPI/tallServiceApi');
var pushMessageApi = require('../../../common/serviceAPI/pushMessageApi');

var messageListArray = [];
var uiArray = [];

function getUserChatList({success: callBack}) {

    
}

function getPushMessageList({success: callBack}) {

    pushMessageApi.getPushMessageList({
        success: function(res){
            console.log(res);
        },
        fail: function(err) {
            console.log(err);
        }
    })
}

/**
 * 初始化界面
 */
function initMessageList(self) {

    tallApi.chat_getList({
        success: function (res) {
            
            messageListArray = res.data.data;

            messageListArray.forEach((v, index) => {
                let item = {
                    listItem: 'listItem' + index,
                    data: {
                        messageIndex: index,
                        mainTitle: v.armariumHaoYouName,
                        date: v.armariumNdate.split(" ")[0],
                        subTitle: v.armariumLt
                    }
                }
                uiArray.push(item);
            })
            if (uiArray.length == 0) {
              wx.showToast({
                title: '无留言记录',
              })
            }
            self.setData({
                messageList: uiArray
            })
        },
        fail: function (err) {
            console.log(err);
        }
    })

    
}

function selectorMessage(index) {

    let item = messageListArray[index];
    wx.navigateTo({
        url: '../tall/tall?chatUserId=' + item.armariumHaoYouId,
    })
}

function clear() {
    uiArray = [];
    messageListArray = [];
}

module.exports = {
    initMessageList: initMessageList,
    selectorMessage: selectorMessage,
   clear: clear
}