// userMessageLike.js
const mineService = require('../../../common/newService/mineService.js');

var userMedical;
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
      userMedical = JSON.parse(options.userSelecteds);
    } else {
      userMedical = [];
    }

    var self = this;
    mineService.getMedicalList(function (res) {

      if (res.data.status == 1 && res.data.disease_list) {
        const likesArray = []
        res.data.disease_list.forEach((v) => {
          const typeItem = {
            id: v.id,
            type_name: v.type_name,
            list: []
          }
          v.list.forEach((v1) => {
            const subItem = {
              id: v1.id,
              type_id: v1.type_id,
              disease_name: v1.disease_name,
              textColor: "black"
            }
            if (userMedical != null) {
              userMedical.forEach(v2 => {
                if (v2.disease_id == v1.id) {
                  subItem.textColor = "#f35b4a"
                }
              })
            } else {
              userMedical = [];
            }
            typeItem.list.push(subItem)
          })
          likesArray.push(typeItem)
        })
        self.setData({
          likes: likesArray
        })
      }
    }, function (err) {
      console.log(err);
    })
  },
  textAction: function (e) {

    const id = e.currentTarget.dataset.id;
    const _likesArray = this.data.likes;
    _likesArray.forEach(v => {
      v.list.forEach(v => {
        if (v.id == id) {
          if (v.textColor == 'black') {
            v.textColor = '#f35b4a';
            const item = {
              disease_id: v.id,
              disease_name: v.disease_name
            }
            userMedical.push(item); // 添加
          } else {
            v.textColor = 'black';
            var index;
            userMedical.forEach((v1, _index) => {
              if (v.id == v1.id) {
                index = _index;
              }
            })
            if (index) {
              userMedical.splice(index-1, 1);// 删除
            }
          }
        }
      });
    });
    this.setData({
      likes: _likesArray
    })
  },

  onUnload: function() {
      this.setData({
        likes: []
      })
      userMedical = null;
  },

  nextAction: function () {

    mineService.updateUserInfo({
      disease: JSON.stringify(userMedical)
    }, function(res){
      wx.showToast({
        title: res.data.msg,
      })
    }, function(err){

    })
  }
})