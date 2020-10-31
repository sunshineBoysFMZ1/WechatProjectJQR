// pages/index/index.js
const API_Url = require('../../utils/API_URL');
const app = getApp();
let roomId = [] // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
let customParams = encodeURIComponent(JSON.stringify({
  path: 'pages/index/index',
  pid: 1
})) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    familyData: [],
    noticeData: [],
    page: 1,
    size: 15,
    is_login: false,
    is_show: 2,
    aloneData: [],
    groupData: [],
    coupon: false,
    biaoti: '',
    bis_show: 0,
    lanmuData: [],
    lpage: 1,
    getTime:0
  },
  // 获取直播列表
  getlist() {
    wx.request({
      url: API_Url.getlist,
      data: {
        page: 1,
        size: 1
      },
      success: (res) => {
        this.setData({
          noticeData: res.data.data,
        });
        roomId = res.data.data[0].roomid;
      }
    })
  },
  // 跳转历史播放
  history() {
    wx.navigateTo({
      url: '/pages/history/history',
    })
  },
  liveVideo(e) {
    console.log(roomId)
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
    })
  },
  videoinfo(e) {
    console.log(e.currentTarget.dataset.id)
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: '/pages/videolist/videoinfo?id=' + e.currentTarget.dataset.id,
      })
    }
  },

  navigator() {
    wx.navigateTo({
      url: '/pages/coupon/coupon',
      success: () => {
        this.setData({
          coupon: true
        });
      }
    })
  },

  closeCoupon: function () {
    this.setData({
      coupon: true
    });
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
    var that = this;
    console.log(options)
    if (options.pid) {
      // wx.showModal({
      //   content:options.pid,
      // })
      wx.setStorageSync('pid', options.pid)
    };
    that.iscoupons();
    that.setData({
      coupon: wx.getStorageSync('is_login')
    })
  },

  iscoupons() {
    wx.request({
      url: API_Url.iscoupons,
      success: (res) => {
        this.setData({
          bis_show: res.data.data.is_show
        })
      }
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
        category_id: 1,
        page: 1,
        size: 20
      },
      success: (res) => {
        var alone = [],
          group = [];
        for (var item of res.data.data) {
          if (item.is_join == 1) {
            alone.push(item)
          } else {
            group.push(item)
          }
        }
        that.setData({
          aloneData: alone,
          groupData: group,
          familyData: res.data.data
        });
      }
    })
  },
  getconfig: function () {
    wx.request({
      url: API_Url.getconfig,
      success: (res) => {
        app.is_show = res.data.data.is_show;
        app.biaoti = res.data.data.biaoti
        app.logo = res.data.data.logo;
        app.sales_num = res.data.data.sales_num
        this.setData({
          is_show: res.data.data.is_show,
          biaoti: app.biaoti
        })
      }
    })
  },
  banner: function () {
    wx.request({
      url: API_Url.banner,
      success: (res) => {
        this.setData({
          swiperList: res.data.data
        })
      }
    })
  },
  // notice: function () {
  //   wx.request({
  //     url: API_Url.notice,
  //     success: (res) => {

  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
    var that = this;
    that.getlistData();
    that.banner();
    // that.notice();
    that.getconfig();
    that.getlist();
    that.updataMange();
    that.lanmu();
    that.setData({
      is_login: wx.getStorageSync('is_login'),
      getTime: new Date().getTime() / 1000
    });
    app.cardetail.cart_id = [];
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success: (res) => {
        console.log(res)
      }
    });
  },
  onShareTimeline: function () {
		return {
	      title: '拼高高机器人',
	      query: "pid=" + wx.getStorageSync('user_id'),
	      imageUrl: ''
	    }
	},
  lanmu() {
    wx.request({
      url: API_Url.lanmu,
      success: (res) => {
        this.setData({
          lanmuData: res.data.data
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
    wx.showLoading();
    setTimeout(() => {
      this.onShow();
      wx.hideLoading({
        complete: (res) => { },
      });
      wx.stopPullDownRefresh({
        complete: (res) => { },
      })
    }, 1000);
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
    var that = this;
    return {
      title: "拼高高机器人",
      path: "/pages/index/index?pid=" + wx.getStorageSync('user_id'),
      success: (res) => {

      }
    }
  },
  /**
   * 用户登录
   */
  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      wx.showToast({
        title: '授权失败',
        icon: "none"
      })
    } else {
      app.uselogin().then(() => {
        that.onShow();
      })
    }
  },
  updataMange: function () {
    if (wx.canIUse("getUpdateManager")) {
      let updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调

      })
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            } else if (res.cancel) {
              return false;
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        wx.hideLoading();
        wx.showModal({
          title: '升级失败',
          content: '新版本下载失败，请检查网络！',
          showCancel: false
        });
      });
    }
  },
})