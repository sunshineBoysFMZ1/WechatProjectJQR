const API_Url = require('../../utils/API_URL');
const WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    TabCur: 0,
    scrollLeft: 0,
    winHeight: '100vh',
    nowstatus: '',
    id: 0,
    courseData: [],
    plistData: [],
    is_show:2,
    content:""
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * @method navigator
   */
  navigator(e) {
    wx.showToast({
      title: '点击购买咨询',
      icon:"none"
    })
    // if (e.currentTarget.dataset.is_charge == 1) {
    //   wx.showToast({
    //     title: '观看课程需要购买当前课程',
    //     icon: "none"
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/shixue/shixue?status=' + 1,
    //   })
    // }
  },
  haveCar: function () {
    wx.request({
      url: API_Url.addcart,
      data: {
        user_id: wx.getStorageSync('user_id'),
        course_id: this.data.id,
        num: 1
      },
      success: (res) => {
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
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

  onPageScroll: function (e) {
    let vm = this;
    var query = wx.createSelectorQuery()
    query.select('.pagecontent').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      if (res[0].top < 0) {  //res[0].top为.距离顶部的位置
        vm.setData({
          hideTop: true
        })
      } else {
        vm.setData({
          hideTop: false
        })
      }
    })
  },
  buy(e) {
    wx.navigateTo({
      url: '../course/orderinfo?id=' + this.data.id + '&status=1' + '&num=1',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    this.courseDetail(this.data.id);
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
    
    this.pllist(this.data.id);
    app.cardetail.cart_id = [];
    this.setData({
      is_show:app.is_show
    })
  },
  /**
   * 课程详情
   * @method courseDetail
   * @parent {number} course_id : 课程id
   */
  courseDetail: function (course_id) {
    const that = this;
    wx.request({
      url: API_Url.courseDetail,
      data: {
        course_id
      },
      success: (res) => {
        if (res.data.code) {
          WxParse.wxParse('article', 'html', res.data.data.content, that, 5);
          that.setData({
            courseData: res.data.data,
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            success: (res) => {
              setTimeout(() => {
                wx.navigateBack()
              }, 2000);
            }
          })
        }
      }
    })
  },
  pllist: function (course_id) {
    wx.request({
      url: API_Url.pllist,
      data: {
        course_id,
        page: 1,
        size: 20
      },
      success: (res) => {
        this.setData({
          plistData: res.data.data
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