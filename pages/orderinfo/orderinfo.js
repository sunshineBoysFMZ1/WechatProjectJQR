const confing = require('../../utils/API_URL');
const app = getApp();
const uts = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: 0,
    orderData: [],
    desc: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.id,
      desc: options.desc
    })
  },
  havecancel: function (e) {
    var md5 = uts.token();
    wx.showModal({
      content: "是否取消订单",
      cancelText: "取消",
      confirmText: "确认",
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: confing.cancel,
            data: {
              order_id: this.data.order_id,
              user_id: wx.getStorageSync('user_id'),
              tokens: md5.tokens,
              timestamp: md5.second
            },
            success: (res) => {
              wx.showToast({
                title: res.data.msg,
              });
              setTimeout(() => {
                wx.navigateBack({
                  complete: (res) => {},
                })
              }, 1200);
            }
          })
        }
      }
    })
  },
  /**确认收货 */
  complete: function (e) {
    var md5 = uts.token();
    wx.showModal({
      content: "是否确认收货",
      confirmText: "确认",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: confing.complete,
            data: {
              order_id: e.currentTarget.dataset.id,
              user_id: wx.getStorageSync('user_id'),
              tokens: md5.tokens,
              timestamp: md5.second
            },
            success: (res) => {
              wx.showToast({
                title: res.data.msg,
                success: () => {
                  setTimeout(() => {
                    wx.navigateBack()
                  }, 1200);
                }
              });
            }
          })
        }
      }
    })
  },
  pingjia(e) {
    app.orderData = JSON.stringify(this.data.orderData.course[0])
    wx.navigateTo({
      url: '../pingjia/pingjia'
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
    this.details();
  },
  details: function () {
    const that = this,
      md5 = uts.token();
    wx.request({
      url: confing.details,
      data: {
        order_id: this.data.order_id,
        user_id: wx.getStorageSync('user_id'),
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        that.setData({
          orderData: res.data.data,
        })
      }
    })
  },
  tuikuan(e) {
    wx.navigateTo({
      url: '../refund/refund?id=' + e.currentTarget.dataset.id,
    })
  },
  Payment: function (e) {
    wx.showLoading({
      title: "支付中"
    })
    var that = this,
      id = this.data.order_id;
    app.weChatPay(id).then((resp) => {
      wx.hideLoading()
      wx.requestPayment({
        nonceStr: resp.data.data.nonceStr,
        package: resp.data.data.package,
        paySign: resp.data.data.paySign,
        timeStamp: resp.data.data.timeStamp,
        signType: resp.data.data.signType,
        success: (res) => {
          wx.showToast({
            title: '支付成功',
            success: () => {
              setTimeout(() => {
                wx.navigateBack()
              }, 1500);
            }
          });

        },
        fail: (res) => {
          wx.showToast({
            title: '支付失败',
            icon: "none"
          })
        },

      })
    }).catch((err) => {
      wx.showToast({
        title: '支付失败',
        icon: "none"
      });
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