// userMessageLike.js
var likesString = '';
var userMessage = new Object();
var userInterest;
const mineService = require('../../../common/newService/mineService.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        likes: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

      if (options.userSelecteds.length != 0) {
        userInterest = JSON.parse(options.userSelecteds);
      } else {
        userInterest = [];
      }
      const self = this;
      mineService.getInterestList(function(res){

        if (res.data.status == 1 && res.data.interest_list) {
          
          const likesArray = []
          res.data.interest_list.forEach((v) => {
            const typeItem = {
              id: v.id,
              type_name: v.type_name,
              list: []
            }
            v.list.forEach((v1) => {
              const subItem = {
                id: v1.id,
                type_id: v1.type_id,
                interest_name: v1.interest_name,
                textColor: "black"
              }
              if (userInterest) {
                userInterest.forEach(v2 => {
                  if (v2.interest_id == v1.id) {
                    subItem.textColor = "#f35b4a"
                  }
                })
              } else {
                userInterest = [];
              }
              typeItem.list.push(subItem)
            })
            likesArray.push(typeItem)
          })
          self.setData({
            likes: likesArray
          })
        }
      }, function(err){

      })
    },
    textAction: function(e) {

      const id = e.currentTarget.dataset.id;
      const _likesArray = this.data.likes;
      _likesArray.forEach(v => {
        v.list.forEach(v => {
          if (v.id == id) {
            if (v.textColor == 'black') {
              v.textColor = '#f35b4a';
              const item = {
                interest_id: v.id,
                interest_name: v.interest_name
              }
              userInterest.push(item); // 添加
            } else {
              v.textColor = 'black';
              var index;
              userInterest.forEach((v1, _index) => {
                if (v.id == v1.id) {
                  index = _index;
                }
              })
              if (index) {
                userInterest.splice(index - 1, 1);// 删除
              }
            }
          }
        });
      });
      this.setData({
        likes: _likesArray
      })
    },
    nextAction: function() {

      mineService.updateUserInfo({
        interest: JSON.stringify(userInterest)
      }, function (res) {
        wx.showToast({
          title: res.data.msg,
        })
      }, function (err) { })
    }
})