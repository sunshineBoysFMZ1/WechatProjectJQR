const confing = require('../../utils/API_URL');
const app = getApp();
const uts = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    image: [],
    id: 0,
    orderData: {},
    cause: ""
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
  ViewImage: function (e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
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
  textareaAInput: function (e) {
    this.setData({
      cause: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderData = JSON.parse(app.orderData),
      that = this;
    that.setData({
      orderData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  userapply: function () {
    var that = this,
      md5 = uts.token();
    console.log(that.data.orderData)
    wx.request({
      url: confing.addpl,
      data: {
        order_id: that.data.orderData.order_id,
        user_id: wx.getStorageSync('user_id'),
        img: that.data.image.join(','),
        content: that.data.cause,
        course_id: that.data.orderData.course_id,
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