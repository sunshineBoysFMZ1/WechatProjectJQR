const confing = require('../../utils/API_URL');
const WxParse = require('../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [{
      id: 0,
      type: 'image',
      url: '/images/gs1.jpg'
    },
    {
      id: 1,
      type: 'image',
      url: '/images/gs2.jpg',
    },
    {
      id: 2,
      type: 'image',
      url: '/images/gs3.jpg'
    },
    {
      id: 3,
      type: 'image',
      url: '/images/gs4.jpg'
    },
    {
      id: 4,
      type: 'image',
      url: '/images/gs5.jpg'
    },
    {
      id: 5,
      type: 'image',
      url: '/images/gs6.jpg'
    }
    ],
    about:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getconfig();
    wx.setNavigationBarTitle({
      title:options.title
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
    
  },
  getconfig:function(){
    var that = this;
    wx.request({
      url: confing.getconfig,
      success:(res)=>{
        WxParse.wxParse('article', 'html', res.data.data.about, that, 5);
        this.setData({
          about:res.data.data.about
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