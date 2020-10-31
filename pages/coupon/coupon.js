const API_Url = require('../../utils/API_URL');
const app = getApp();
const uts = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponData: [],
    is_login: false,
    logo: ""
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

  onShow: function () {
    var that = this;
    that.setData({
      is_login: wx.getStorageSync('is_login'),
      logo: app.logo
    });
    this.canReceive();
  },
  /**
   * 可领取优惠券
   * @method canReceive 
   * @parent {number,string} user_id 用户id
   */
  canReceive: function () {
    const that = this,
      md5 = uts.token();
    wx.request({
      url: API_Url.canReceive,
      data: {
        user_id: wx.getStorageSync('user_id'),
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
   * 领取优惠券
   * @method getcoupon 
   * @parent {sting} {
   *    coupon_id : 	优惠券id,
   *    user_id   : 用户id
   *  }
   */
  getcoupon: function (e) {
    const that = this,
      md5 = uts.token();
    wx.request({
      url: API_Url.receive,
      data: {
        coupon_id: e.currentTarget.dataset.id,
        user_id: wx.getStorageSync('user_id'),
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        if (res.data.code) {
          wx.showToast({
            title: res.data.msg,
            success: () => {
              that.onShow()
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            success: () => {
              that.onShow()
            }
          })
        }
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
    wx.showLoading()
    setTimeout(() => {
      this.onShow();
      wx.hideLoading();
      wx.stopPullDownRefresh()
    }, 1000);
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

  },
  /**
* 用户登录
*/
  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      wx.showToast({
        title: '授权失败',
        icon: "none"
      })
    } else {
      app.uselogin().then(() => {
        that.onShow();
      })
    }
  }
})