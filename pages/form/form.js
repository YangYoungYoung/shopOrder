// pages/form/form.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    if (orderId == '' || orderId==undefined){
      common.showTip('当前没有订单','loading');
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
    // var order_id = "25767795778125825";
    var order_id = wx.getStorageSync("orderId");
    // console.log("当前的订单总价是：" + money);
    wx.request({
      url: 'https://weixin.cmdd.tech/weixin/getRepayId',
      data: {
        appNum: 1,
        openId: openId,
        money: money

      },
      header: { //请求头
        "Content-Type": "applciation/json"
      },
      method: "GET", //get为默认方法/POST

      success: function(res) {
        wx.hideLoading();
        // console.log("支付的返回值是：" + res.data);
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.paySign,
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
            // console.log("调起支付失败" + res.err_desc)
            wx.showToast({
              title: "支付失败",
              duration: 1500
            })
          },
          'complete': function(res) {}
        })
      },
      fail: function(err) {
        common.showTip("网络错误", "loading");
      }, //请求失败
      complete: function() {} //请求完成后执行的函数
    })
    // let url = "weixin/getRepayId"
    // var params = {
    //   openid: openId
    //   // orderId: orderid,
    //   // totalPrice: money
    // }
    // let method = "GET";

    // wx.showLoading({
    //     title: '加载中...',
    //   }),
    //   network.POST(url, params, method).then((res) => {

    //     console.log("支付的返回值是：" + res.data);
    //     wx.requestPayment({
    //       'timeStamp': res.data.timeStamp,
    //       'nonceStr': res.data.nonceStr,
    //       'package': res.data.package,
    //       'signType': 'MD5',
    //       'paySign': res.data.paySign,
    //       'success': function(res) {
    //         // console.log("调起支付成功")
    //         wx.hideLoading();
    //         wx.showToast({
    //           title: "支付成功",
    //           icon: 'succes',
    //           duration: 1500
    //         })
    //         // that.updateOrderState();
    //       },
    //       'fail': function(res) {
    //         console.log("调起支付失败" + res.data)
    //         wx.showToast({
    //           title: "支付失败",
    //           duration: 1500
    //         })
    //       },
    //       'complete': function(res) {}
    //     })
    //   }).catch((errMsg) => {
    //     wx.hideLoading();
    //     console.log(errMsg); //错误提示信息
    //     wx.showToast({
    //       title: '网络错误',
    //       icon: 'loading',
    //       duration: 1500,
    //     })
    //   });
    // that.onShow()
  },
  //支付回调接口
  payRequest: function() {
    var that = this;
    var orderId = wx.getStorageSync("orderId");
    // var order_id = "25767795778125825";
    var money = that.data.totalPrice;
    let url = "api/weiXin/paymentCallback"
    let method = "POST"
    var params = {
      description: money,
      order_id: orderId,
      service_type: "3",
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("支付回调：" + res.data);
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '../msg/msg',
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