// pages/welcome/welcome.js
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true, //是否出现焦点  
    circular: true,
    welcomeList: [
      '../images/welcome1.jpg',
      '../images/welcome2.jpg',
      '../images/welcome3.jpg',
      '../images/welcome4.jpg'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let isFirst = wx.getStorageSync('isFirst');
    if (isFirst) {
      wx.redirectTo({
        url: '../index/index',
      })
    }
  },
  toIndex: function() {
    wx.setStorageSync('isFirst', true);
    wx.redirectTo({
      url: '../index/index',
    })
  }
  // //获取用户openId接口
  // getOP: function (res) { //提交用户信息 获取用户id
  //   let that = this;
  //   let code = that.data.code;
  //   let shopId = that.data.shopId;
  //   let url = "authorize/getOpenId";

  //   var params = {
  //     shopId: 1
  //   }
  //   let method = "POST";
  //   wx.showLoading({
  //     title: '加载中...',
  //   }),
  //     network.POST(url, params, method).then((res) => {
  //       wx.hideLoading();

  //     }).catch((errMsg) => {
  //       wx.hideLoading();
  //       // console.log(errMsg); //错误提示信息
  //       wx.showToast({
  //         title: '网络错误',
  //         icon: 'loading',
  //         duration: 1500,
  //       })
  //     });
  // },

})