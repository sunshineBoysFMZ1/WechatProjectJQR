
const API_Url = require('../../utils/API_URL');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    familyData: [],
    is_show: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title:options.title
    })
  },
  buy(e){
    wx.navigateTo({
      url: 'course?id='+e.currentTarget.dataset.id,
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
    this.getlistData();
    this.setData({
      is_show: app.is_show
    })
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
        category_id: 2,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})