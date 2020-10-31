const confing = require('../../utils/API_URL');
const uts = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    image: [],
    id: 0,
    orderData: [],
    cause: "",
    about: ''
  },
  ChooseImage() {
    wx.chooseImage({
      count: 3, //默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        };
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        this.uploadimg({
          path: res.tempFilePaths
        })
      }
    });
  },
  /**下载 */
  uploadimg: function (data) {
    var that = this;
    var i = data.i ? data.i : 0;
    var num = 0;
    wx.uploadFile({
      filePath: data.path[i],
      name: 'file',
      url: confing.upload,
      formData: {
        file: data.path[i]
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: (res) => {
        var res = JSON.parse(res.data);
        if (res.code == 1) {
          that.data.image.push(res.data.img)
        }
        that.setData({
          img: that.data.image
        })
        num++;
        wx.showLoading({
          title: num + '/' + data.path.length
        })
      },
      fail: (res) => {
        console.log(res)
      },
      complete: () => {
        i++;
        if (i == data.path.length) {
          wx.hideLoading();
          wx.showToast({
            title: '图片上传成功',
          })
        } else {
          data.i = i;
          that.uploadimg(data);
        }
      }
    })
  },

  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.data.image.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList,
            image: this.data.image
          })
        }
      }
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    })
  },
  textareaAInput: function (e) {
    this.setData({
      cause: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  userapply: function () {
    var md5 = uts.token();
    wx.request({
      url: confing.refund,
      data: {
        order_id: this.data.id,
        user_id: wx.getStorageSync('user_id'),
        img: this.data.image.join(','),
        cause: this.data.cause,
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        wx.showToast({
          title: res.data.msg,
          success: () => {
            setTimeout(() => {
              wx.navigateBack()
            }, 2000);
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.details(this.data.id);
    this.getconfig();
  },
  getconfig: function () {
    wx.request({
      url: confing.getconfig,
      success: (res) => {
        this.setData({
          about: res.data.data.refund_xz
        })
      }
    })
  },
  details: function (order_id) {
    var md5 = uts.token();
    const that = this;
    wx.request({
      url: confing.details,
      data: {
        order_id,
        user_id: wx.getStorageSync('user_id'),
        tokens: md5.tokens,
        timestamp: md5.second
      },
      success: (res) => {
        that.setData({
          orderData: res.data.data
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