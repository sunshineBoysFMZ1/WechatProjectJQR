const API_Url = require('../../utils/API_URL');
const app = getApp();
const WxParse = require('../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    id: 0,
    videoData: [],
    status: -1,
    is_show: 2,
    sales_num: 0,
    index: 0
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      TabCur: e.detail.current
    });
  },
  gobuy(e) {
    wx.navigateTo({
      url: '../courselist/courselist',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: options.status,
      sales_num: app.sales_num,
      TabCur: options.index
    });
    this.trylearn();
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

    this.setData({
      is_show: app.is_show
    })
  },
  /**
   * 试学详情
   * @method trylearn
   * @parent {number} category_id : 1家庭课程 2幼儿园课程
   */
  /**
   * 生命周期函数--监听页面隐藏
   */
  trylearn: function () {
    const that = this;
    wx.request({
      url: API_Url.trylearn,
      data: {
        category_id: that.data.status ? 2 : 1
      },
      success: (res) => {
        for (var item in res.data.data) {
          if (res.data.data[item].course_no == 1) {
            that.data.videoData.unshift(res.data.data[item]);
            WxParse.wxParse('article1', 'html', res.data.data[item].content, that, 5);
          } else if (res.data.data[item].course_no == 2) {
            that.data.videoData.push(res.data.data[item]);
            WxParse.wxParse('article2', 'html', res.data.data[item].content, that, 5);
          } else {
            that.data.videoData.push(res.data.data[item]);
            WxParse.wxParse('article3', 'html', res.data.data[item].content, that, 5);
          }
          // res.data.data[item].course_no.content.replace('<img ', '<img style="max-width:100%;height:auto;display:block;margin:10px 0;"') 
        };
        that.setData({
          videoData: that.data.videoData
        });
        console.log(that.data.videoData)
      }
    })
  },
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