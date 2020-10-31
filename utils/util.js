var utilMd5 = require('./md5.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function token() {
    // var myDate = new Date();
    // var second = myDate.getTime() / 1000;
    var  targetTimezone = -8;
    var dif = new Date().getTimezoneOffset();
    var east9time = new Date().getTime() + dif * 60 * 1000 - (targetTimezone * 60 * 60 * 1000);
    var time = new Date(east9time) / 1000;
    var second = parseInt(time);
     var k = wx.getStorageSync('token');
     var tokens = utilMd5.hexMD5(k + second);
    return {
        tokens,
        second
    }
}
module.exports = {
  formatTime: formatTime,
    token
}
// // 目标时区，东8区
//   var  targetTimezone = -8;;
// // 当前时区与中时区时差，以min为维度
// const dif = new Date().getTimezoneOffset();
// // 本地时区时间 + 本地时区时差  = 中时区时间
// // 目标时区时间 + 目标时区时差 = 中时区时间
// // 目标时区时间 = 本地时区时间 + 本地时区时差 - 目标时区时差
// // 东8区时间
// const east9time = new Date().getTime() + dif * 60 * 1000 - (targetTimezone * 60 * 60 * 1000);
// console.log('new Date(east9time)', dif, new Date(east9time)); 