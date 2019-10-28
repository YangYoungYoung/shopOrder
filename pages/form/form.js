// pages/form/form.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice:0,
    hasPay:false,
    hasView:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.getOrderList();
  },

  //查看订单列表
  getOrderList: function() {
    let that = this;
    let shopId = wx.getStorageSync('shopId');
    let orderId = wx.getStorageSync('orderId');
    if (orderId == '' || orderId == undefined) {
      common.showTip('当前没有订单', 'loading');
      return
    }

    let url = "order/select";
    var params = {
      shopId: 1,
      orderId: orderId
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        if (res.data.code == 200) {
          console.log('res.data.data :', res.data.data);
          let orderList = res.data.data.jsonArray;
          let totalPrice = res.data.data.totalPrice;
          if (orderList[0].status==4){
            that.setData({
              hasPay:true
            })
          }
          if (orderList.length>0){
            that.setData({
              hasView:true
            })
          }
          that.setData({
            orderList: orderList,
            totalPrice: totalPrice
          })
        }
      });
  },
  //发起支付
  payOrder: function(e) {
    var that = this;
    var money = that.data.totalPrice * 100;
    var openId = wx.getStorageSync("openId")
    let url = "weixin/pay"
    var params = {
      openId: openId,
      // orderId: orderid,
      money: money
      // money:1
    }
    let method = "GET";

    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {

        console.log("支付的返回值是：" + res.data);
        if (res.data.code == 200) {
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'RSA',
            'paySign': res.data.data.paySign,
            'success': function(res) {
              // console.log("调起支付成功")
              wx.hideLoading();
              wx.showToast({
                title: "支付成功",
                icon: 'succes',
                duration: 1500
              })
              that.payRequest();
            },
            'fail': function(res) {
              console.log("调起支付失败:",  res)
              wx.showToast({
                title: "支付失败",
                duration: 1500,
                icon:'loading'
              })
              // common.showTip('支付失败', 'loading');
            },
            'complete': function(res) {}
          })
        }

      });
    // that.onShow()
  },
  //支付回调接口
  payRequest: function() {
    var that = this;
    var orderId = wx.getStorageSync("orderId");
    var shopId = wx.getStorageSync("shopId");
    // var order_id = "25767795778125825";
    // var money = that.data.totalPrice;
    let url = "order/updateStatusAndPayTime"
    let method = "GET"
    var params = {
      // description: money,
      orderId: orderId,
      shopId: 1
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("支付回调：" + res.data);
        if (res.data.code == 200) {
          that.setData({
            hasPay: true
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
  //暂不支付，只提交
  toIndex:function(){
    wx.redirectTo({
      url: '../index/index',
    })
  }
})