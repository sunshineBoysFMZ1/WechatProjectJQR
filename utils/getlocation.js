var $citys = require('../utils/citys');
var cityData = $citys.data;
module.exports = {
    // 根据省市区名称去查当位置的code 
    city_name: function () {
        return new Promise(function (reslove, reject) {
            wx.getLocation({
                type: 'gcj02',
                success: (res) => {
                    var getAddressUrl = "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude + "&key=VGUBZ-FPQKJ-LVQFJ-KZ3A2-45X65-3XFLO";
                    wx.request({
                        url: getAddressUrl,
                        success: (res) => {
                            var i = 0;
                            //城市
                            var provinces = [];
                            var citys = [];
                            var countys = [];
                            for (var item of cityData) {
                                i++;
                                if (item.name == res.data.result.address_component.province) {
                                    cityData.unshift(cityData[i - 1]);//省
                                    cityData.splice(i, 1);
                                    for (let i = 0; i < cityData.length; i++) {
                                        provinces.push(cityData[i].name);
                                    };
                                    // 市
                                    var cnum = 0;
                                    for (var city of cityData[0].sub) {
                                        cnum++;
                                        if (city.name == res.data.result.address_component.city) {
                                            cityData[0].sub.unshift(cityData[0].sub[cnum - 1]);
                                            cityData[0].sub.splice(cnum, 1);
                                            for (let i = 0; i < cityData[0].sub.length; i++) {
                                                citys.push(cityData[0].sub[i].name);
                                            };
                                            // 区/县
                                            var qnum = 0;
                                            for (var qu of cityData[0].sub[0].sub) {
                                                qnum++;
                                                if (qu.name == res.data.result.address_component.district) {
                                                    cityData[0].sub[0].sub.unshift(cityData[0].sub[0].sub[qnum - 1]);
                                                    cityData[0].sub[0].sub.splice(qnum, 1);
                                                    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
                                                        countys.push(cityData[0].sub[0].sub[i].name)
                                                    };
                                                    var data = {
                                                        provinces,
                                                        citys,
                                                        countys,
                                                        code: [cityData[0].code, cityData[0].sub[0].code, cityData[0].sub[0].sub[0].code]
                                                    }
                                                    reslove(data)
                                                    return;
                                                }
                                            }
                                            return;
                                        }
                                    }
                                    return;
                                };
                            };
                        }
                    });
                },
                fail: () => {
                    // 默认北京
                    var i = 0;
                    //城市
                    var provinces = [];
                    var citys = [];
                    var countys = [];
                    for (var item of cityData) {
                        i++;
                        if (item.name == '北京市') {
                            cityData.unshift(cityData[i - 1]);//省
                            cityData.splice(i, 1);
                            for (let i = 0; i < cityData.length; i++) {
                                provinces.push(cityData[i].name);
                            };
                            // 市
                            var cnum = 0;
                            for (var city of cityData[0].sub) {
                                cnum++;
                                if (city.name == '北京市') {
                                    cityData[0].sub.unshift(cityData[0].sub[cnum - 1]);
                                    cityData[0].sub.splice(cnum, 1);
                                    for (let i = 0; i < cityData[0].sub.length; i++) {
                                        citys.push(cityData[0].sub[i].name);
                                    };
                                    // 区/县
                                    var qnum = 0;
                                    for (var qu of cityData[0].sub[0].sub) {
                                        qnum++;
                                        if (qu.name == '东城区') {
                                            cityData[0].sub[0].sub.unshift(cityData[0].sub[0].sub[qnum - 1]);
                                            cityData[0].sub[0].sub.splice(qnum, 1);
                                            for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
                                                countys.push(cityData[0].sub[0].sub[i].name)
                                            };
                                            var data = {
                                                provinces,
                                                citys,
                                                countys,
                                                code: [cityData[0].code, cityData[0].sub[0].code, cityData[0].sub[0].sub[0].code]
                                            }
                                            reslove(data)
                                            return;
                                        }
                                    }
                                    return;
                                }
                            }
                            return;
                        };
                    };
                }
            });

        })
    },
    // 根据code 获取
    city_code: function (code) {
        return new Promise(function (reslove, reject) {
            var i = 0;
            //城市
            var provinces = [];
            var citys = [];
            var countys = [];
            for (var item of cityData) {
                i++;
                if (item.code == code[0]) {
                    cityData.unshift(cityData[i - 1]);//省
                    cityData.splice(i, 1);
                    for (let i = 0; i < cityData.length; i++) {
                        provinces.push(cityData[i].name);
                    };
                    // 市
                    var cnum = 0;
                    for (var city of cityData[0].sub) {
                        cnum++;
                        if (city.code == code[1]) {
                            cityData[0].sub.unshift(cityData[0].sub[cnum - 1]);
                            cityData[0].sub.splice(cnum, 1);
                            for (let i = 0; i < cityData[0].sub.length; i++) {
                                citys.push(cityData[0].sub[i].name);
                            };
                            // 区/县
                            var qnum = 0;
                            for (var qu of cityData[0].sub[0].sub) {
                                qnum++;
                                if (qu.code == code[2]) {
                                    cityData[0].sub[0].sub.unshift(cityData[0].sub[0].sub[qnum - 1]);
                                    cityData[0].sub[0].sub.splice(qnum, 1);
                                    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
                                        countys.push(cityData[0].sub[0].sub[i].name)
                                    };
                                    var data = {
                                        provinces,
                                        citys,
                                        countys,
                                        code: [cityData[0].code, cityData[0].sub[0].code, cityData[0].sub[0].sub[0].code]
                                    }
                                    reslove(data)
                                    return;
                                }
                            }
                            return;
                        }
                    }
                    return;
                };

            };
        })
    }
}