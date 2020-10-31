const confing = require('../../utils/API_URL');
const app = getApp();
const uts = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   * status 0 ? 购物车 1 立即
   */
  data: {
    orderData: [],
    coupon: [],
    status: 0,
    num: 1,
    course_id: 0,
    err: false
  },
  haveAdd() {
    wx.navigateTo({
      url: '/pages/address/address?type=1',
    })
  },
  /**规格 */
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
   * 使用优惠券
   * @method haveCoupon
   * @param {} options 
   */
  haveCoupon: function (e) {
    this.setData({
      coupon: this.data.orderData.coupon.coupon[e.currentTarget.dataset.index],
      modalName: null
    })
  },
  /**
   * 创建订单
   * @method createorder 
   * @param {} options 
   */
  createorder: function () {
    const that = this,
      md5 = uts.token();
    try {
      wx.request({
        url: confing.createorder,
        data: {
          user_id: wx.getStorageSync('user_id'),
          course_id: that.data.status == true ? that.data.course_id : '',
          address_id: that.data.orderData.address.id,
          num: that.data.status == true ? that.data.num : '',
          cart_id: that.data.status == true ? '' : app.cardetail.cart_id,
          total_price: (Number(that.data.orderData.price) - Number(that.data.coupon.money) ? Number(that.data.orderData.price) - Number(that.data.coupon.money) : Number(that.data.orderData.price)).toFixed(2),
          coupon_code: that.data.coupon.code ? that.data.coupon.code : '',
          tokens: md5.tokens,
          timestamp: md5.second
        },
        success: (res) => {
          try {
            if (res.data.code) {
              that.weChatPay(res)
            } else {
              wx.showToast({
                title: '提交订单失败,稍后重试',
                icon: "none"
              })
            }
          } catch (error) {
            wx.showToast({
              title: '提交订单失败,稍后重试',
              icon: "none"
            })
          }
        }
      })
    } catch (error) {
      wx.showToast({
        title: '请先添加收货地址',
        icon: "none"
      });
      return;
    }
  },
  weChatPay: function (res) {
    var md5 = uts.token();
    wx.showLoading({
      title: "支付..."
    })
    new Promise(function (reslove, reject) {
      wx.request({
        url: confing.pay,
        data: {
          user_id: wx.getStorageSync('user_id'),
          order_id: res.data.data.order_id,
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
    }).then((resp) => {
      wx.hideLoading()
      wx.requestPayment({
        nonceStr: resp.data.data.nonceStr,
        package: resp.data.data.package,
        paySign: resp.data.data.paySign,
        timeStamp: resp.data.data.timeStamp,
        signType: resp.data.data.signType,
        success: (res) => {
          wx.showToast({
            title: '支付成功',
            success: () => {
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/my/my',
                })
              }, 1000);
            }
          })
        },
        fail: (res) => {
          console.log(res)
          wx.showToast({
            title: '支付失败订单已创建',
            icon: "none",
            success: (res) => {
              setTimeout(() => {
                wx.navigateBack()
              }, 2000);
            }
          })
        }
      })
    }).catch((err) => {
      wx.showToast({
        title: '支付订单失败,稍后重试',
        icon: "none"
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: options.status,
      num: options.num,
      course_id: options.id
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
    this.confirm();
  },
  /**确认订单 
   * @method confirm
   * 
   */
  confirm: function () {
    const that = this,
      md5 = uts.token();
    if (that.data.status == true) {
      var data = {
        user_id: wx.getStorageSync('user_id'),
        course_id: that.data.course_id,
        num: that.data.num,
        cart_id: '',
        tokens: md5.tokens,
        timestamp: md5.second
      }
    } else {
      var data = {
        user_id: wx.getStorageSync('user_id'),
        course_id: '',
        num: 0,
        cart_id: app.cardetail.cart_id,
        tokens: md5.tokens,
        timestamp: md5.second
      }
    }
    wx.request({
      url: confing.confirm,
      data,
      success: (res) => {
        try {
          for (var item of res.data.data.course) {
            if (typeof item.img != 'string') {
              item.img = item.img[0]
            }
          }
          console.log(res.data.data.coupon, res.data.data.coupon.max)
          that.setData({
            orderData: res.data.data,
            coupon: (res.data.data.coupon.length == 0 || res.data.data.coupon.max.length == 0) ? {
              money: 0,
              code: '',
              title: "无可用优惠券"
            } : res.data.data.coupon.max,
            err: false
          });
        } catch (error) {
          wx.showToast({
            title: '请先添加收货地址才能正常提交订单',
            icon: "none",
          });
          this.setData({
            err: true
          })
        }
      }
    })

  },
  paycoupon() {
    this.setData({
      coupon: {
        money: 0,
        code: '',
        title: "不使用优惠券"
      },
      modalName: null
    })
  },
  donw: function () {
    wx.navigateTo({
      url: '/pages/coupon/coupon',
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