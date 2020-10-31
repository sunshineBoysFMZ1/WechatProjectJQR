const confing = require('../../utils/API_URL');
const uts = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: ''
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
  usetext: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  bind: function () {
    var md5 = uts.token();
    if (this.data.code.length == 0) {
      wx.showToast({
        title: '请输入需要绑定的课程码',
        icon: "none"
      });
      return;
    }
    if (wx.getStorageSync('user_id')) {
      wx.request({
        url: confing.bind,
        data: {
          user_id: wx.getStorageSync('user_id'),
          code: this.data.code,
          tokens: md5.tokens,
          timestamp: md5.second
        }, success: (res) => {
          if (res.data.code) {
            wx.showToast({
              title: res.data.msg,
              success: () => {
                setTimeout(() => {
                  wx.navigateBack({
                    complete: (res) => { },
                  })
                }, 1500);
              }
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '登陆后绑定课程',
        icon: "none"
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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