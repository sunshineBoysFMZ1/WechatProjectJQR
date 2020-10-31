const confing = require('../../utils/API_URL');
const uts = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navState: 0,
    ktx: 0
  },
  navSwitch: function (e) {
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      this.setData({
        navState: 0
      })
    } else if (index == 1) {
      this.setData({
        navState: 1
      })
    } else {
      this.setData({
        navState: 2
      })
    }
  },
  formSubmit: function (e) {
    var data = e.detail.value,
      md5 = uts.token();
    for (var item in data) {
      if (data[item] == '') {
        wx.showToast({
          title: '请填写完整申请信息',
          icon: "none"
        });
        return;
      }
    };
    wx.request({
      url: confing.applytx,
      data: {
        user_id: wx.getStorageSync('user_id'),
        price: data.price,
        type: Number(this.data.navState) + 1,
        name: data.uname,
        zfb: Number(this.data.navState) + 1 == 2 ? data.zhanghao : '',
        bank: Number(this.data.navState) + 1 == 3 ? data.bname : '',
        bank_cark: Number(this.data.navState) + 1 == 3 ? data.zhanghao : "",
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        if (res.data.code) {
          wx.showToast({
            title: res.data.msg,
            success: () => {
              setTimeout(() => {
                wx.navigateBack()
              }, 1000);
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ktx: options.ktx
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