
const API_Url = require('../../utils/API_URL');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    familyData: [],
    page: 1
  },
  buy(e) {
    wx.navigateTo({
      url: '../course/orderinfo?id=' + e.currentTarget.dataset.id + '&status=1' + '&num=1',
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getlistData();
  },
  /**
 * 课程列表
 * @method getlistData
 * @parent {number} {
 *    category_id : 1家庭课程 2幼儿园课程
 *    page:页数
 *    size	条数
 * }
 */
  getlistData: function () {
    const that = this;
    wx.request({
      url: API_Url.getlistindex,
      data: {
        category_id: 1,
        page: 1,
        size: 20
      },
      success: (res) => {
        that.setData({
          familyData: res.data.data
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
    var p = this.data.page < 2 ? 2 : this.data.page
    wx.request({
      url: API_Url.getlistindex,
      data: {
        category_id: 1,
        page: p,
        size: 20
      },
      success: (res) => {
        if (res.data.data.length) {
          var content = this.data.familyData.concat(res.data.data);
          p++
          that.setData({
            familyData: content,
            page: p
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