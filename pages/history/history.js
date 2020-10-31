// pages/history/history.js
const API_Url = require('../../utils/API_URL');
let roomId = [] // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
let customParams = encodeURIComponent(JSON.stringify({
    path: 'pages/index/index',
    pid: 1
})) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）

Page({

    /**
     * 页面的初始数据
     */
    data: {
        noticeData: [],
        getTime: 0,
        page: 1,
        size: 10
    },
    liveVideo(e) {
        wx.navigateTo({
            url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${e.currentTarget.dataset.id}&custom_params=${customParams}`
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    // 获取直播列表
    getlist() {
        wx.request({
            url: API_Url.getlist,
            data:{
                page:1,
                size:10
            },
            success: (res) => {
                this.setData({
                    noticeData: res.data.data,
                });
            }
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
        var that = this;
        that.getlist();
        that.setData({
            getTime: new Date().getTime() / 1000
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
        var that = this;
        wx.showLoading();
        setTimeout(() => {
            wx.hideLoading({
                complete: (res) => { },
            });
            wx.stopPullDownRefresh({
                complete: (res) => { },
            })
            that.setData({
                page: 1
            })
            that.onShow();
        }, 1000);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var that = this,
            p = that.data.page < 2 ? 2 : that.data.page;
        wx.request({
            url: API_Url.getlist,
            data: {
                page: p,
                size: 10
            },
            success: (res) => {
                if (res.data.data.length) {
                    var content = that.data.noticeData.concat(res.data.data);
                    p++
                    that.setData({
                        noticeData: content,
                        page:p
                    });
                }else{
                    wx.showToast({
                      title: '没有更多的直播信息了',
                      icon:"none"
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