const confing = require('../../utils/API_URL');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    videoData: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let is_show = app.is_show;
    wx.setNavigationBarTitle({
      title:options.title
    })
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
    this.opus();
  },
  opus: function () {
    wx.request({
      url: confing.opus,
      data: {
        page: 1,
        size: 10
      },
      success: (res) => {
        this.setData({
          videoData: res.data.data
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
    wx.showLoading({
      title: "加载中"
    })
    setTimeout(() => {
      this.onShow();
      this.setData({
        page: 1
      })
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var p = that.data.page < 2 ? 2 : that.data.page;
    wx.request({
      url: confing.opus,
      data: {
        page: p,
        size: 10
      },
      success: (res) => {
        if (res.data.data.length) {
          var content = this.data.videoData.concat(res.data.data);
          p++;
          this.setData({
            videoData: content,
            page: p
          })
        } else {
          wx.showToast({
            title: '没有跟多的视频作品了',
            icon: "none"
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})