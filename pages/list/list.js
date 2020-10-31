// pages/list/list.js
const API_Url = require('../../utils/API_URL')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lanmuData: []
    },
    DetailPath(e) {
        wx.navigateTo({
            url: '/' + e.currentTarget.dataset.path,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.lanmu();
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
    lanmu() {
        wx.request({
            url: API_Url.lanmu,
            success: (res) => {
                this.setData({
                    lanmuData: res.data.data
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
        this.lanmu();
        wx.showLoading();
        setTimeout(() => {
            wx.stopPullDownRefresh();
            wx.hideLoading();
        }, 1000);
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