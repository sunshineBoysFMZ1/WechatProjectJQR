const confing = require('../../utils/API_URL');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    detail: [],
    page: 1,
    showlist: [],
    mid:0,
    is_show:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      mid: options.mid
    })
    this.courseCatalogDetail(options.id);
  },
  courseCatalogDetail: function (course_catalog_id) {
    wx.request({
      url: confing.courseCatalogDetail,
      data: {
        course_catalog_id
      },
      success: (res) => {
        this.setData({
          detail: res.data.data
        })
      }
    })
  },
  coursecatalogtask: function (course_catalog_id) {
    wx.request({
      url: confing.coursecatalogtask,
      data: {
        course_catalog_id,
        page: 1,
        size: 10
      },
      success: (res) => {
        this.setData({
          showlist: res.data.data
        })
      }
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
    this.coursecatalogtask(this.data.mid)
    this.setData({
      is_show:app.is_show
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
      p = that.data.page < 2 ? 2 : that.data.page;
    wx.request({
      url: confing.coursecatalogtask,
      data: {
        course_catalog_id: this.data.id,
        page: p,
        size: 10
      },
      success: (res) => {
        if (res.data.data.length) {
          var content = that.data.showlist.concat(res.data.data);
          p++
          this.setData({
            showlist: content,
            page: p
          })
        } else {
          wx.showToast({
            title: '没有更多的作业展示了',
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