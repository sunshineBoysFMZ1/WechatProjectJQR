const confing = require('../../utils/API_URL');
const app = getApp();
const uts = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    status: 1,
    orderData: [],
    value: '',
    page: 1
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      page: 1,
      status: Number(e.currentTarget.dataset.id) + 1,
      value: ''
    });
    this.orderlist();
  },
  userHave: function (e) {
    this.setData({
      value: e.detail.value
    });
    this.orderlist();
  },
  tuikuan(e) {
    wx.navigateTo({
      url: '../refund/refund?id=' + e.currentTarget.dataset.id,
    })
  },

  pingjia(e) {
    app.orderData = JSON.stringify(this.data.orderData[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: '../pingjia/pingjia'
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
              order_id: e.currentTarget.dataset.id,
              user_id: wx.getStorageSync('user_id'),
              tokens: md5.tokens,
              timestamp: md5.second
            },
            success: (res) => {
              wx.showToast({
                title: res.data.msg,
              });
              this.orderlist();
            }
          })
        }
      }
    })
  },
  Payment: function (e) {
    wx.showLoading({
      title: "支付中"
    })
    var id = e.currentTarget.dataset.id,
      that = this,
      md5 = uts.token();
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
            title: '支付成功'
          });

        },
        fail: (res) => {
          wx.showToast({
            title: '支付失败',
            icon: "none"
          })
        },
        complete: () => {
          that.orderlist();
        }
      })
    }).catch((err) => {
      wx.showToast({
        title: '支付失败',
        icon: "none"
      });
      that.orderlist();
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
              });
              this.orderlist();
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      TabCur: options.i,
      status: Number(options.i) + 1
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
    this.orderlist();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 订单列表
   * @method orderlist
   * @param {number,string} status 1全部 2待付款 3待发货 4待收货 5待评价 6退款
   */
  orderlist: function () {
    const that = this,
      md5 = uts.token();
    wx.request({
      url: confing.orderlist,
      data: {
        user_id: wx.getStorageSync('user_id'),
        status: that.data.status,
        page: 1,
        size: 10,
        search: that.data.value,
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        that.setData({
          orderData: res.data.data,
          page: 1
        })
      }
    })
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
      url: confing.orderlist,
      data: {
        user_id: wx.getStorageSync('user_id'),
        status: that.data.status,
        page: p,
        size: 10,
        search: that.data.value,
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        if (res.data.data.length) {
          var content = that.data.orderData.concat(res.data.data);
          p++;
          that.setData({
            orderData: content,
            page: p
          })
        } else {
          wx.showToast({
            title: '没有更多的课程订单了',
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