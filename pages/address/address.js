// pages/address/address.js
var confing = require('../../utils/API_URL');
var app = getApp();
const uts = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 20,
    getlist: [],
    status: 0,
    type: 0
  },
  /**
   * 添加 修改地址 
   */
  addaddress: function () {
    wx.navigateTo({
      url: '/pages/address/add?status=2',
    })
  },
  setdefault: function (e) {
    var md5 = uts.token();
    wx.request({
      url: confing.setdefault,
      data: {
        id: e.currentTarget.dataset.id,
        user_id: wx.getStorageSync('user_id'),
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        if (res.data.code) {
          wx.showToast({
            title: res.data.msg,
            success: () => {
              if (this.data.type) {
                wx.navigateBack();
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        this.getlist();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: options.status,
      type: options.type
    })
  },
  /**
   * getlist 地址列表uid  page size
   */
  getlist: function () {
    var that = this,
      md5 = uts.token();
    wx.request({
      url: confing.getlists,
      data: {
        user_id: wx.getStorageSync('user_id'),
        page: that.data.page,
        size: that.data.size,
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        that.setData({
          getlist: res.data.data
        })
      }
    })
  },
  delete: function (e) {
    var that = this,
      md5 = uts.token();
    wx.showModal({
      content: "是否删除当前位置信息",
      cancelText: "取消",
      confirmText: "确认",
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: confing.delete,
            data: {
              id: e.currentTarget.dataset.id,
              user_id: wx.getStorageSync('user_id'),
              tokens: md5.tokens,
              timestamp: md5.second
            },
            success: (res) => {
              wx.showToast({
                title: res.data.msg,
              });
              this.getlist();
            }
          })
        }
      }
    })
  },
  /**
   * 订单页跳转
   */
  select: function (e) {
    app.getlocation.addid = e.currentTarget.dataset.id;
    app.getlocation.boole = true;
    app.getlocation.content.name = e.currentTarget.dataset.name;
    app.getlocation.content.phone = e.currentTarget.dataset.phone;
    app.getlocation.content.address = e.currentTarget.dataset.add;
    app.getlocation.content.detail = e.currentTarget.dataset.deta;
    app.getlocation.content.pcode = e.currentTarget.dataset.code;
    wx.navigateBack({
      complete: (res) => { },
    });
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
    this.getlist();
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