const API_Url = require('../../utils/API_URL');
const app = getApp();
const WxParse = require('../../utils/wxParse/wxParse.js');
const uts = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    TabCur: 0,
    scrollLeft: 0,
    winHeight: '100vh',
    nowstatus: '',
    id: 0,
    courseData: [],
    plistData: [],
    goodsInfoImg: "",
    is_login: false,
    is_show: 2,
    page:1
  },
  showModal(e) {
    if (wx.getStorageSync('is_login')) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      wx.showToast({
        title: '请先登录授权',
        icon: "none"
      })
    }
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * @method navigator
   */
  navigator(e) {
    wx.navigateTo({
      url: '/pages/mycourse/video?id=' + e.currentTarget.dataset.id + '&mid=' + e.currentTarget.dataset.mid,
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      TabCur: e.detail.current
    });
  },

  onPageScroll: function (e) {
    let vm = this;
    var query = wx.createSelectorQuery()
    query.select('.pagecontent').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      if (res[0].top < 0) {  //res[0].top为.距离顶部的位置
        vm.setData({
          hideTop: true
        })
      } else {
        vm.setData({
          hideTop: false
        })
      }
    })
  },
  buy(e) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    this.courseDetail(this.data.id);
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

    this.pllist(this.data.id);
    this.courseQrcode();
    this.setData({
      is_login: wx.getStorageSync('is_login'),
      is_show: app.is_show
    })
    app.cardetail.cart_id = [];
  },
  /**
   * 课程详情
   * @method courseDetail
   * @parent {number} course_id : 课程id
   */
  courseDetail: function (course_id) {
    const that = this;
    wx.request({
      url: API_Url.courseDetail,
      data: {
        course_id
      },
      success: (res) => {
        if (res.data.code) {
          WxParse.wxParse('article', 'html', res.data.data.content, that, 5);
          that.setData({
            courseData: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            success: (res) => {
              setTimeout(() => {
                wx.navigateBack()
              }, 1200);
            }
          })
        }
      }
    })
  },
  pllist: function (course_id) {
    wx.request({
      url: API_Url.pllist,
      data: {
        course_id,
        page: 1,
        size: 20
      },
      success: (res) => {
        this.setData({
          plistData: res.data.data
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
    var p = this.data.page < 2 ? 2 : this.data.page;
    wx.request({
      url: API_Url.pllist,
      data: {
        course_id:this.data.id,
        page: p,
        size: 20
      },
      success: (res) => {
        if(res.data.data.length){
          var content = this.data.plistData.concat(res.data.data);
          p++;
          this.setData({
            plistData: content,
            page:p
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**分享海报 */
  courseQrcode: function () {
    if (wx.getStorageSync('is_login')) {
      wx.request({
        url: API_Url.courseQrcode,
        data: {
          user_id: wx.getStorageSync('user_id'),
          course_id: this.data.id
        },
        success: (res) => {
          if (res.data.code == 1) {
            this.setData({
              goodsInfoImg: res.data.data.ewm
            });
          }
        }
      })
    }
  },
  shareUse: function () {
    wx.previewImage({
      urls: [this.data.goodsInfoImg],
      current: this.data.goodsInfoImg
    })
  },
  /**
  * 下载图片
  */
  uploadimg: function () {
    wx.showLoading();
    var that = this;
    wx.getSetting({
      complete: (res) => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          if (that.data.goodsInfoImg == '' || that.data.goodsInfoImg == undefined) {
            wx.showToast({
              title: '下载失败,稍后重试',
              icon: "none"
            });
            return;
          }
          wx.downloadFile({
            url: that.data.goodsInfoImg,
            success: (res) => {
              that.uploadphone(res.tempFilePath);
              that.setData({
                img: res.tempFilePath
              })
            }
          })
        } else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.downloadFile({
                url: that.data.goodsInfoImg,
                success: (res) => {
                  that.uploadphone(res.tempFilePath);
                  that.setData({
                    img: res.tempFilePath
                  })
                }
              })
            },
            fail() {
              that.authConfirm()
            }
          })
        } else {
          this.authConfirm();
        }
      }
    })

  },
  // 授权拒绝后，再次授权提示弹窗
  authConfirm() {
    let that = this
    wx.showModal({
      content: '检测到您没打开保存图片权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success(res) {
              if (res.authSetting['scope.writePhotosAlbum']) {
                wx.downloadFile({
                  url: that.data.goodsInfoImg,
                  success: (res) => {
                    that.uploadphone(res.tempFilePath);
                    that.setData({
                      img: res.tempFilePath
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: '您没有授权，无法保存到相册',
                  icon: 'none'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '您没有授权，无法保存到相册',
            icon: 'none'
          })
        }
      }
    });
  },
  uploadphone: function (filePath) {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath,
      success: (res) => {
        wx.showToast({
          title: '保存相册',
        })
      },
      fail: () => {
        wx.showToast({
          title: '保存失败',
          icon: "none"
        })
      }
    })
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