
var $citys = require('../../utils/citys.js');
var confing = require('../../utils/API_URL');
var getadd = require('../../utils/getlocation');
var cityData = $citys.data;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinces: [],
    citys: [],
    countys: [],
    cityValue: [0, 0, 0],
    cityText: '请选择地址',
    isDate: true,
    isCity: true,
    photoList: [],
    address: '',
    acode: [110000, 110000, 110101],
    uname: '',
    uphone: "",
    uaddress: '',
    status: 1,
    address_id: 0
  },
  /**定位当前位置 选择位置 */
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        });
        var getAddressUrl = "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude + "&key=VGUBZ-FPQKJ-LVQFJ-KZ3A2-45X65-3XFLO";
        wx.request({
          url: getAddressUrl,
          success: (res) => {
            if (that.data.status != 1) {
              that.setData({
                cityText: res.data.result.address_component.province + ' ' + res.data.result.address_component.city + ' ' + res.data.result.address_component.district,
              });
              getadd.city_name().then((res) => {
                that.setData({
                  citys:res.citys,
                  countys:res.countys,
                  provinces:res.provinces,
                  'acode[0]':res.code[0],
                  'acode[1]':res.code[1],
                  'acode[2]':res.code[2]
                })
              })
            } else {
              //根据code 获取选择的省市区排在第一个
              var code = that.data.acode
              getadd.city_code(code).then((res) => {
                that.setData({
                  citys:res.citys,
                  countys:res.countys,
                  provinces:res.provinces,
                  'acode[0]':res.code[0],
                  'acode[1]':res.code[1],
                  'acode[2]':res.code[2]
                })
              })
            }
          }
        });
      },
      fail: () => {
        getadd.city_name().then((res) => {
          that.setData({
            citys:res.citys,
            countys:res.countys,
            provinces:res.provinces,
            'acode[0]':res.code[0],
            'acode[1]':res.code[1],
            'acode[2]':res.code[2],
            cityText:"北京市"+' '+'北京市'+' '+'东城区'
          })
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocation();
    this.setData({
      status: options.status,
    });
    if (options.status == 1) {
      this.edit(options.id);
      this.setData({
        address_id: options.id
      })
    }
  },
  edit: function (address_id) {
    var that = this;
    wx.request({
      url: confing.edit,
      data: {
        address_id
      },
      success: (res) => {
        this.setData({
          cityText: res.data.data.address,
          uname: res.data.data.name,
          uphone: res.data.data.phone,
          uaddress: res.data.data.detail,
          address_id: res.data.data.address_id,
          'acode[0]': res.data.data.province_id,
          'acode[1]': res.data.data.city_id,
          'acode[2]': res.data.data.region_id
        })
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
    // this.accredit();
  },
  /**微信定位授权 */
  accredit:function(){
    var that = this;
    wx.getSetting({
      complete: (res) => {
        if(!res.authSetting['scope.userLocation']){
         wx.showModal({
            content:'检测到您没打开此小程序的定位权限，是否去设置打开?',
            confirmText:'确认',
            cancelText:'取消',
            success:(res)=>{
              if(res.confirm){
                wx.openSetting({
                  complete: (res) => {},
                })
              }
            }
         })
        }else{
          this.getLocation();
        }
      },
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

  //调起选择器
  risePicker: function (e) {
    var that = this;
    var $mold = e.currentTarget.dataset.mold;
    if ($mold == 'city') {
      that.setData({
        isCity: false
      });
      // that.getlocation();
    }

  },
  //城市选择器
  cityChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var that = this;
    var t = this.data.cityValue;
    var citys = that.data.citys;
    var countys = that.data.countys
    var address = '';
    if (val[0] != t[0]) {
      citys = [];
      countys = [];
      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        citys: citys,
        countys: countys,
        cityValue: [val[0], 0, 0]
      })
      address += cityData[val[0]].name + " " + cityData[val[0]].sub[0].name + " " + cityData[val[0]].sub[0].sub[0].name;
      that.data.acode[0] = cityData[val[0]].code;
      that.data.acode[1] = cityData[val[0]].sub[0].code;
      that.data.acode[2] = cityData[val[0]].sub[0].sub[0].code;
      this.setData({
        address,
        acode: that.data.acode
      })
      return;
    }
    if (val[1] != t[1]) {
      var countys = [];
      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }
      this.setData({
        countys: countys,
        cityValue: [val[0], val[1], 0]
      })
      that.data.acode[0] = cityData[val[1]].sub[0].code;
      that.data.acode[1] = cityData[val[0]].sub[val[1]].code;
      that.data.acode[2] = cityData[val[0]].sub[val[1]].sub[0].code;
      address += cityData[val[0]].name + " " + cityData[val[0]].sub[val[1]].name + " " + cityData[val[0]].sub[val[1]].sub[0].name;
      this.setData({
        address,
        acode: that.data.acode
      })
      return;
    }
    if (val[2] != t[2]) {
      this.setData({
        county: this.data.countys[val[2]],
        cityValue: val
      })
      address += cityData[val[0]].name + " " + cityData[val[0]].sub[val[1]].name + " " + cityData[val[0]].sub[val[1]].sub[val[2]].name;
      that.data.acode[0] = cityData[val[0]].code;
      that.data.acode[1] = cityData[val[0]].sub[val[1]].code;
      that.data.acode[2] = cityData[val[0]].sub[val[1]].sub[val[2]].code;
      this.setData({
        address,
        acode: that.data.acode
      })
      return;
    }


  },

  //确定选择
  ideChoice: function (e) {
    var that = this;
    //城市
    if (that.data.address == '') {
      var cityText = that.data.cityText
    } else {
      var cityText = that.data.address
    }
    that.setData({
      cityText,
    })
    that.setData({
      isCity: true,
      isDate: true,
    });
    console.log(that.data.acode)
  },

  text: function (e) {
    var that = this;
    if (e.currentTarget.dataset.i == 0) {
      that.setData({
        uname: e.detail.value
      })
    } else if (e.currentTarget.dataset.i == 1) {
      that.setData({
        uphone: e.detail.value
      })
    } else {
      that.setData({
        uaddress: e.detail.value
      })
    }
  },
  /**
   * add
   */
  add: function () {
    var that = this;
    if(that.data.uname == '' || that.data.uphone == '' || that.data.uaddress == ''){
      wx.showToast({
        title: '请填写完整信息',
        icon:"none"
      });
      return;
    }
    if (that.data.status == 1) {
      var url = confing.edit_do;
      var data = {
        name: that.data.uname,
        phone: that.data.uphone,
        province_id: that.data.acode[0],
        city_id: that.data.acode[1],
        region_id: that.data.acode[2],
        detail: that.data.uaddress,
        uid: wx.getStorageSync('uid'),
        address_id: that.data.address_id
      }
    } else {
      var url = confing.adds; 
      var data = {
        name: that.data.uname,
        phone: that.data.uphone,
        province_id: that.data.acode[0],
        city_id: that.data.acode[1],
        region_id: that.data.acode[2],
        detail: that.data.uaddress,
        uid: wx.getStorageSync('uid')
      }
    }
    wx.request({
      url,
      data,
      success: (res) => {
        wx.showToast({
          title: res.data.msg,
          icon: "none",
          success: (res) => {
            setTimeout(() => {
              wx.navigateBack({})
            }, 800);
          }
        })
      }
    })
  },
})