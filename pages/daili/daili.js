const confing = require('../../utils/API_URL')
const WxParse = require('../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    about:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getconfig();
    wx.setNavigationBarTitle({
      title:options.title
    })
  }, 
  formSubmit:function(e){
    var data = e.detail.value;
    for(var item in data){
      if(data[item]==''){
        wx.showToast({
          title: '请您填写完整申请信息',
          icon:"none"
        })
      }
    };
    wx.request({
      url:confing.dlapply,
      data:{
        name:data.uname,
        mobile:data.phone
      },
      success:(res)=>{
        wx.showToast({
          title: res.data.msg,
          icon:"none"
        });
        setTimeout(() => {
          wx.navigateBack()
        }, 2000);
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onShow: function () {
    
  },
  getconfig:function(){ 
    var that = this;
    wx.request({
      url: confing.getconfig,
      success:(res)=>{
        WxParse.wxParse('article', 'html', res.data.data.dlzm, that, 5);
        // this.setData({
        //   about:res.data.data.dlzm.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
        // })
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