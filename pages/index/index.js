//index.js
//获取应用实例
var network = require("../../utils/network.js");
const app = getApp()

Page({
  data: {
    indicatorDots: true, //是否出现焦点  
    autoplay: true, //是否自动播放轮播图  
    interval: 4000, //时间间隔
    duration: 1000, //延时时间
    circular: true,
    wifi: '',
    phone: '',
    openId: '',
    imageList: [],
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
  /***--*
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    /****
     * 这里要获取shopId和tableId
     * 
     * **/
    this.getShopInfo();
  },
  onShow: function(e) {
    let openId = wx.getStorageSync('openId');
    console.log('openId is:', openId);
    if (openId != undefined || openId != '') {
      this.setData({
        openId: openId
      })
    }


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
    let shopId = that.data.shopId;
    let url = "authorize/getOpenId";

    var params = {
      code: code,
      shopId: 1
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
  },
  //打开地图导航
  toMap: function() {
    let shop = this.data.shopInfo;
    let longitude = Number(shop.longitude); //经度
    let latitude = Number(shop.latitude); //纬度
    // wx.navigateTo({
    //   url: '../detailMap/detailMap?longitude=' + longitude + '&latitude='+latitude,
    // })
    wx.openLocation({ //​使用微信内置地图查看位置。
      latitude: latitude, //要去的纬度-地址
      longitude: longitude, //要去的经度-地址
      name: shop.name,
      address: shop.address
    })
  },
  //点击预览大图
  previewImage: function(e) {
    var current = e.target.dataset.src;
    // console.log('current is:', current);
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.shopInfo.details // 需要预览的图片http链接列表  
    })
  },
  //获取商铺信息
  getShopInfo: function() {
    let that = this;
    let shopId = that.data.shopId;
    let url = "shop/shopDetails"
    var params = {
      // code:code
      shopId: 1
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          let shop = res.data.data;
          that.setData({
            shopInfo: shop
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
  callPhone: function(e) {
    let phone = e.currentTarget.dataset.phone;
    // console.log('phone is:', phone);
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  }

})