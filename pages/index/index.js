//index.js
//获取应用实例
var network = require("../../utils/network.js");
const app = getApp()

Page({
  data: {
    openId:'',
    menu: [{
        name: "开始点餐",
        image: "../images/order.jpg"
      },
      {
        name: "菜品进度",
        image: "../images/schedule.jpg"
      },
      {
        name: "我的订单",
        image: "../images/form.jpg"
      },
      {
        name: "意见反馈",
        image: "../images/feedback.jpg"
      },
      // {
      //   name: "奖品查询",
      //   image: "../images/gift.png"
      // },

      // {
      //   name: "意见反馈",
      //   image: "../images/opinion.png"
      // },
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


  },
  onShow: function(e) {
    let openId = wx.getStorageSync('openId');
    console.log('openId is:', openId);
    this.setData({
      openId: openId
    })
  },
  //授权权限
  bindGetUserInfo(res) {
    let that = this;
    let info = res;
    let index = res.currentTarget.dataset.index;
    that.setData({
      index: index
    })

    // console.log(info);
    if (info.detail.userInfo) {

      // console.log("userInfo:", info.detail.userInfo);
      wx.setStorageSync('user', info.detail.userInfo);
      that.setData({
        user: info.detail.userInfo
      })
      // console.log("点击了同意授权");
      // that.hidePermissionModal();
      wx.login({
        success: function(res) {
          if (res.code) {
            that.setData({
              code: res.code
            })
            that.getOP();
          } else {
            // console.log("授权失败");
            common.showTip('授权失败', loading);
          }
        },
      })

    } else {
      // console.log("点击了拒绝授权");
    }
  },

  //获取用户openId接口
  getOP: function(res) { //提交用户信息 获取用户id
    let that = this;
    let code = that.data.code;

    wx.showLoading({
      title: '加载中...',
    })
    let url = "authorize/getOpenId?code=" + code

    var params = {
      // code:code
    }
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();

        let openId = res.data.openid;
        // console.log("获取openId：", openId);
        wx.setStorageSync('openId', openId);
        let index = that.data.index;
        switch (index) {
          case 0:
            wx.navigateTo({
              url: '../order/order',
            })
            break;
          case 1:
            wx.navigateTo({
              url: '../schedule/schedule',
            })
            break;
          case 2:
            wx.navigateTo({
              url: '../form/form',
            })
            break;
          case 3:
            wx.navigateTo({
              url: '../feedback/feedback',
            })
            break;
          default:
            wx.navigateTo({
              url: '../order/order',
            })
        }


      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },
  //直接跳转
  navigateTo: function(e) {
    let index = e.currentTarget.dataset.index;
    switch (index) {
      case 0:
        wx.navigateTo({
          url: '../order/order',
        })
        break;
      case 1:
        wx.navigateTo({
          url: '../schedule/schedule',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '../form/form',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '../feedback/feedback',
        })
        break;
      default:
        wx.navigateTo({
          url: '../order/order',
        })
    }
  }

})