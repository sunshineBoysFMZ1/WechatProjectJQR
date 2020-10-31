const confing = require('../../utils/API_URL');
const uts = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    status: 1,
    page: 1,
    listData: []
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      status: Number(e.currentTarget.dataset.id) + 1
    });
    this.txlist();
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
    this.txlist();
  },
  txlist: function () {
    var md5 = uts.token();
    wx.request({
      url: confing.txlist,
      data: {
        user_id: wx.getStorageSync('user_id'),
        status: this.data.status,
        page: 1,
        size: 20,
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        this.setData({
          listData: res.data.data
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
    var that = this,
      p = that.data.page < 2 ? 2 : that.data.page,
      md5 = uts.token();
    wx.request({
      url: confing.txlist,
      data: {
        user_id: wx.getStorageSync('user_id'),
        status: this.data.status,
        page: p,
        size: 20,
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        if (res.data.data.length) {
          var content = that.data.listData.concat(res.data.data);
          p++;
          this.setData({
            listData: content,
            page: p
          })
        } {
          wx.showToast({
            title: '没有更多的提现信息',
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