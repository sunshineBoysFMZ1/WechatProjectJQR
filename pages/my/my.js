//my.js
//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logo:'',
    is_login:true
  },

  order(e) {
    wx.navigateTo({
      url: '../myorder/myorder?i=' + e.currentTarget.dataset.i,
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
    var that = this;
    that.setData({
      userInfo: wx.getStorageSync('byuserInfo'),
      user_id: wx.getStorageSync('user_id'),
      is_login: wx.getStorageSync('is_login'),
      level: wx.getStorageSync('level'),
      logo:app.logo
    });
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
  }
})
