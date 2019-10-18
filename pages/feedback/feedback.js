// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //js
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value);
    var that = this;
    that.setData({
      details: e.detail.value
    });
  },

  evaSubmit:function(){
    console.log('提交表单');
  }
 
})