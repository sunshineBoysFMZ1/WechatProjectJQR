//app.js
const confing = require('./utils/API_URL');
const uts = require('./utils/util')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  /**
  * 用户登录
  */
  uselogin: function () {
    var that = this;
    // 登录
    return new Promise(function (reslove, reject) {
      wx.login({
        success: res => {
          wx.request({
            url: confing.register,
            data: {
              code: res.code,
              pid: wx.getStorageSync('pid')
            },
            success: (res) => {
              if (res.data.code == 1) {
                wx.setStorageSync('token', res.data.data.token);
                wx.setStorageSync('openid', res.data.data.openid);
                wx.setStorageSync('user_id', res.data.data.id);
                wx.setStorageSync('is_login', true);
                reslove(res.data.data.openid);
              } else {
                wx.showToast({
                  title: '获取信息失败',
                  icon: "none"
                });
                return;
              }
            }
          })
        }
      })
    }).then((openid) => {
      // 获取用户信息
      return new Promise(function (reslove, reject) {
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  wx.setStorageSync('byuserInfo', res.userInfo);//备用用户信息
                  var data = {
                    openid,
                    nickname: res.userInfo.nickName,
                    avatar: res.userInfo.avatarUrl
                  };
                  reslove(data)
                }
              })
            }
          }
        })
      })
    }).then((data) => {
      wx.request({
        url: confing.login,
        data,
        success: (res) => {
          if (res.data.code == 1) {
            wx.showToast({
              title: res.data.msg,
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }
        }
      })
    })
  },
  globalData: {
    userInfo: null
  },
  /**
  * 购物车 id
  */
  cardetail: {
    car_id: []
  },
  /**支付 */
  weChatPay: function (order_id) {
    var md5 = uts.token();
    return new Promise(function (reslove, reject) {
      wx.request({
        url: confing.pay,
        data: {
          user_id: wx.getStorageSync('user_id'),
          order_id,
          tokens: md5.tokens,
          timestamp: md5.second
        },
        success: (resp) => {
          if (resp.data.code) {
            reslove(resp)
          } else {
            reject()
          }
        }
      })
    })
  },
  /**续费 */
  weCahatxf: function (course_id, course_code) {
    var md5 = uts.token();
    return new Promise(function (reslove, reject) {
      wx.request({
        url: confing.payxf,
        data: {
          user_id: wx.getStorageSync('user_id'),
          course_id,
          course_code,
          tokens: md5.tokens,
          timestamp: md5.second
        },
        success: (resp) => {
          if (resp.data.data && resp.data.code) {
            reslove(resp)
            console.log('正常续费')
          } else if (resp.data.code != true) {
            reject(resp)
            console.log('未使用')
          } else if (resp.data.data != true && resp.data.code) {
            console.log('0')
            wx.showToast({
              title: resp.data.msg,
            });
            // reject(resp)
          }
        }
      })
    })
  },
  // 1显示 : 2不显示
  is_show: 2,
  biaoti: '',
  logo: "",
  orderData: '',
  sales_num: 0
})