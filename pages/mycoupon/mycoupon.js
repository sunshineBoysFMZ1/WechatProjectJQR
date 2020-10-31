const API_Url = require('../../utils/API_URL');
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
    size: 10,
    couponData: []
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      status: Number(e.currentTarget.dataset.id) + 1,
      page: 1,
      couponData: []
    })
    this.couponlist();
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
    this.couponlist();
  },
  /**
   * 我的优惠券
   * @method couponlist
   * @parnet {number} {
   *  user_id : 用户id,
   *  status  : 1可用 2已用 3已过期,
   *  page    : 页数,
   *  size    : 条数
   *  }
   */
  couponlist: function () {
    const that = this,
      md5 = uts.token();
    wx.request({
      url: API_Url.couponlist,
      data: {
        user_id: wx.getStorageSync('user_id'),
        status: that.data.status,
        page: 1,
        size: that.data.size,
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        that.setData({
          couponData: res.data.data
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
    const that = this,
      md5 = uts.token();
    var p = that.data.page < 2 ? 2 : that.data.page;
    wx.request({
      url: API_Url.couponlist,
      data: {
        user_id: wx.getStorageSync('user_id'),
        status: that.data.status,
        page: p,
        size: that.data.size,
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        if (res.data.data) {
          var content = that.data.couponData.concat(res.data.data);
          p++;
          that.setData({
            couponData: content,
            page: p
          })
        } else {
          wx.showToast({
            title: '没有更多的优惠券',
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