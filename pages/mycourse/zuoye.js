const confing = require('../../utils/API_URL');
const uts = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: '',
    video_path: '',
    mid: 0,
    id: 0,
    content: ''
  },
  ChooseImage() {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        that.setData({
          videoList: res.tempFilePath
        })
        that.uploadimg({
          path: res.tempFilePath
        })
      }
    })
  },
  /**下载 */
  uploadimg: function (data) {
    var that = this;
    wx.uploadFile({
      filePath: data.path,
      name: 'file',
      url: confing.upload,
      formData: {
        file: data.path
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: (res) => {
        var res = JSON.parse(res.data);
        that.setData({
          video_path: res.data.img
        })
      },
      fail: (res) => {
        console.log(res)
      },
      complete: () => {
        wx.showToast({
          title: '上传完成',
        })
      }
    })
  },

  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除视频吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.setData({
            videoList: '',
            video_path: ''
          })
        }
      }
    })
  },
  textareaAInput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  settask: function () {
    var md5 = uts.token();
    if (this.data.video_path == "") {
      return wx.showToast({
        title: '请上传视频作业哦',
        icon: "none"
      })
    }
    wx.request({
      url: confing.settask,
      data: {
        course_id: this.data.id,
        course_catalog_id: this.data.mid,
        video_path: this.data.video_path,
        content: this.data.content,
        user_id: wx.getStorageSync('user_id'),
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        if (res.data.code) {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            success: () => {
              setTimeout(() => {
                wx.navigateBack({
                  complete: (res) => { },
                })
              }, 1200);
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
    console.log(options)
    this.setData({
      id: options.id,
      mid: options.mid
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