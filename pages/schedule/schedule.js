// pages/schedule/schedule.js
var network = require("../../utils/network.js");
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasView:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrderStatus();
  },
  //获取菜单状态
  getOrderStatus: function(res) { 
    let that = this;
    let shopId = wx.getStorageSync('shopId');
    let orderId = wx.getStorageSync('orderId');
    if(orderId==undefined||orderId==''){
      common.showTip('暂无订单','loading');
      return;
    }
    let url = "order/selectStatus";

    var params = {
      shopId:1,
      orderId: orderId 
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if(res.data.code==200){
          let orderList = res.data.data;
          if (orderList.length>0){
            that.setData({
              hasView: true
            })
            
          }
          that.setData({
            orderList: orderList
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

})