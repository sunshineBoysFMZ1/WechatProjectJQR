const confing = require('../../utils/API_URL');
const uts = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.bindlist();
    this.getconfig();
  },
  bindlist: function () {
    var md5 = uts.token();
    wx.request({
      url: confing.bindlist,
      data: {
        user_id: wx.getStorageSync('user_id'),
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        this.setData({
          courseData: res.data.data
        })
      }
    })
  },
  getconfig: function () {
    wx.request({
      url: confing.getconfig,
      success: (res) => {
        app.is_show = res.data.data.is_show;
        app.biaoti = res.data.data.biaoti
        app.logo = res.data.data.logo;
        app.sales_num = res.data.data.sales_num
        this.setData({
          is_show: res.data.data.is_show,
          biaoti: app.biaoti
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})