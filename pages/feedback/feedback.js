// pages/feedback/feedback.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  //获取多行输入框参数
  bindTextAreaBlur: function(e) {
    // console.log(e.detail.value);
    var that = this;
    that.setData({
      details: e.detail.value
    });
  },

  evaSubmit: function() {
    var that = this;
    var openId = wx.getStorageSync("openId");
    var shopId = wx.getStorageSync("shopId");
    let details = that.data.details;
    let url = "feedback/add"
    let method = "GET"
    var params = {
      openId: openId,
      shopId: 1,
      remark: details
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          common.showTip('反馈成功', 'success');
        }
      })
  }
})