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
    page: 1,
    DataDetail: []
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      status: Number(e.currentTarget.dataset.id) + 1,
      page: 1
    });
    this.coursecode();
  },
  payxf: function (e) {
    var that = this;
    wx.showLoading({
      title: "支付中"
    })
    app.weCahatxf(e.currentTarget.dataset.id, e.currentTarget.dataset.code).then((resp) => {
      wx.hideLoading()
      wx.requestPayment({
        nonceStr: resp.data.data.nonceStr,
        package: resp.data.data.package,
        paySign: resp.data.data.paySign,
        timeStamp: resp.data.data.timeStamp,
        signType: resp.data.data.signType,
        success: (res) => {
          wx.showToast({
            title: '支付成功,续费完成',
            icon: "none"
          });
        },
        fail: (res) => {
          console.log(res)
          wx.showToast({
            title: '支付失败',
            icon: "none"
          })
        },
        complete: () => {
          that.coursecode();
        }
      })
    }).catch((err) => {
      wx.showToast({
        title: err.data.msg == '' ? '支付失败' : err.data.msg,
        icon: "none"
      });
    });
    that.coursecode();
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
    this.coursecode();
  },
  coursecode: function () {
    var md5 = uts.token();
    wx.request({
      url: confing.coursecode,
      data: {
        user_id: wx.getStorageSync('user_id'),
        status: this.data.status,
        page: 1,
        size: 10,
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        for (var item of res.data.data) {
          item.code = item.code.split(',')
        }
        this.setData({
          DataDetail: res.data.data
        });
      }
    })
  },
  setClipboardData: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.code,
      success: (res) => {
        wx.showToast({
          title: '复制成功',
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
      url: confing.coursecode,
      data: {
        user_id: wx.getStorageSync('user_id'),
        status: this.data.status,
        page: p,
        size: 10,
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        if (res.data.data.length) {
          for (var item of res.data.data) {
            item.code = item.code.split(',')
          }
          var content = that.data.DataDetail.concat(res.data.data);
          p++;
          this.setData({
            DataDetail: content,
            page: p
          });
        } else {
          wx.showToast({
            title: '没有更多的数据了',
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