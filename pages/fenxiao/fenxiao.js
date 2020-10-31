const confing = require('../../utils/API_URL');
const uts = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sales: {},
    about: ""
  },
  apply(e) {
    wx.navigateTo({
      url: '../applytx/applytx?ktx=' + e.currentTarget.dataset.ktx,
    })
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
  getconfig: function () {
    wx.request({
      url: confing.getconfig,
      success: (res) => {
        this.setData({
          about: res.data.data.fx_xz
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.myfx();
    this.getconfig();
  },
  myfx: function () {
    var md5 = uts.token();
    wx.request({
      url: confing.myfx,
      data: {
        user_id: wx.getStorageSync('user_id'),
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        this.setData({
          sales: res.data.data
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