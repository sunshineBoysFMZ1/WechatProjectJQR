// pages/shoppingcart/shoppingcart.js
const confing = require('../../utils/API_URL');
const app = getApp();
const uts = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showView: true,
    Car_shoop: [],
    shoop_id: [],
    /**商品id */
    shoopPrice: 0,
    shoopAuto: false,
    page: 1
  },
  bindjiesuan: function () {
    var that = this;
    if (that.data.shoop_id == 0) {
      wx.showToast({
        title: '请先选择商品',
        icon: "none"
      });
      return;
    }
    app.cardetail.cart_id = that.data.shoop_id.join(',');
    wx.navigateTo({
      url: '/pages/course/orderinfo?status=-1',
    })
  },
  /**删除商品 */
  deleteShoop: function () {
    var that = this,
      Car_shoop = that.data.Car_shoop,
      dShoop = [],
      md5 = uts.token();
    for (var shoop of Car_shoop) {
      if (shoop.checked) {
        dShoop.push(shoop.id);
      };
    };
    if (dShoop == false) {
      wx.showToast({
        title: '至少选择一个商品',
        icon: "none"
      });
      return;
    };
    wx.request({
      url: confing.delcart,
      data: {
        cart_ids: dShoop.join(','),
        user_id: wx.getStorageSync('user_id'),
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        wx.showToast({
          title: res.data.msg,
          success: () => {
            that.onShow();
            that.condition();
            that.setData({
              shoopPrice: 0
            })
          }
        })
      }
    })
  },
  /**选中商品 */
  shoopChecked(e) {
    var index = e.currentTarget.dataset.index,
      that = this,
      Car_shoop = that.data.Car_shoop;
    Car_shoop[index].checked = !Car_shoop[index].checked
    that.setData({
      Car_shoop
    });
    that.condition();
  },
  /**计算价钱,和计算价钱的条件,全选条件 */
  condition: function () {
    var that = this,
      Car_shoop = that.data.Car_shoop,
      shoop_id = that.data.shoop_id,
      shoopPrice = that.data.shoopPrice;
    shoop_id = [],
      shoopPrice = 0;
    for (var shoop of Car_shoop) {
      if (shoop.checked) {
        /**获取商品id */
        shoop_id.push(shoop.id);
        /**计算选中价钱 */
        shoopPrice += shoop.num * shoop.course.price
      }
    };
    that.setData({
      shoop_id,
      shoopPrice: shoopPrice.toFixed(2)
    });
    if ((that.data.shoop_id.length == Car_shoop.length) && Car_shoop.length) {
      that.setData({
        shoopAuto: true
      })
    } else {
      that.setData({
        shoopAuto: false
      })
    };
  },
  /**数量+ */
  num_jia: function (e) {
    var index = e.currentTarget.dataset.index,
      that = this,
      Car_shoop = that.data.Car_shoop;
    Car_shoop[index].num = Car_shoop[index].num += 1,
      md5 = uts.token();
    wx.request({
      url: confing.setnum,
      data: {
        cart_id: Car_shoop[index].id,
        num: Car_shoop[index].num,
        gid: Car_shoop[index].gid,
        sku_id: Car_shoop[index].skuid,
        user_id: wx.getStorageSync('user_id'),
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {

      }
    })
    that.setData({
      Car_shoop
    });
    that.condition();
  },
  /**数量- */
  num_jian: function (e) {
    var index = e.currentTarget.dataset.index,
      that = this,
      Car_shoop = that.data.Car_shoop,
      md5 = uts.token();
    if (Car_shoop[index].num == 1) {
      wx.showToast({
        title: '不能再少了哦',
        icon: "none"
      });
      return;
    }
    Car_shoop[index].num = Car_shoop[index].num -= 1;
    wx.request({
      url: confing.setnum,
      data: {
        cart_id: Car_shoop[index].id,
        num: Car_shoop[index].num,
        gid: Car_shoop[index].gid,
        sku_id: Car_shoop[index].skuid,
        user_id: wx.getStorageSync('user_id'),
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {

      }
    })
    that.setData({
      Car_shoop
    });
    that.condition();
  },

  /**全选 */
  bindSelectAll: function () {
    var that = this,
      shoopAuto = that.data.shoopAuto,
      Car_shoop = that.data.Car_shoop;
    // 如果全选为false 点击就要为true;
    shoopAuto = !that.data.shoopAuto;
    for (var shoop of Car_shoop) {
      shoop.checked = shoopAuto
    };
    that.setData({
      Car_shoop,
      shoopAuto
    });
    that.condition();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**购物车列表 */
  getcartall: function () {
    var that = this,
      md5 = uts.token();
    if (wx.getStorageSync('user_id')) {
      wx.request({
        url: confing.cartlist,
        data: {
          user_id: wx.getStorageSync('user_id'),
          page: 1,
          size: 15,
          tokens: md5.tokens,
          timestamp: md5.second
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          for (var shoop of res.data.data) {
            shoop.checked = false
          }
          that.setData({
            Car_shoop: res.data.data
          });
          this.condition();
        }
      })
    }
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
    this.getcartall();
    app.cardetail.cart_id = [];
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
  ShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
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
      p = that.data.page < 2 ? 2 : that.data.page,
      md5 = uts.token();
    wx.request({
      url: confing.cartlist,
      data: {
        user_id: wx.getStorageSync('user_id'),
        page: p,
        size: 15,
        tokens: md5.tokens,
        timestamp: md5.second
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data.data != "") {
          for (var shoop of res.data.data) {
            shoop.checked = false
          }
          var content = that.data.Car_shoop.concat(res.data.data);
          p++;
          that.setData({
            Car_shoop: content,
            page: p
          });
          that.condition();
        } else {
          wx.showToast({
            title: '没有更多的商品信息',
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