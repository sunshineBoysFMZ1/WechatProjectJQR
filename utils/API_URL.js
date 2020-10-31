const URL = 'https://wx.pingaogao.cn/api';
module.exports ={
    // 课程列表(首页)
    getlistindex:URL+'/pgg/course/getlist',
    //课程详情(pages/course/course)
    courseDetail:URL+'/pgg/course/courseDetail', 
    // 优惠券(pages/coupon/coupon)
    canReceive:URL+'/pgg/coupons/canReceive',
    // 试学详情(pages/shixue/shixue)
    trylearn:URL+'/pgg/course/trylearn', 
    // 领取优惠券(pages/coupon/coupon)
    receive:URL+'/pgg/coupons/receive',
    // 我的优惠券列表
    couponlist:URL+'/pgg/coupons/couponlist',
    // 添加地址(pages/address/add)
    adds:URL+'/pgg/address/adds',
    // 地址列表(pages/address/address)
    getlists:URL+'/pgg/address/getlist',
    // 设置默认地址(pages/address/address)
    setdefault:URL+'/pgg/address/setdefault',
    // 删除地址(pages/address/address)
    delete:URL+'/pgg/address/delete',
    // 获取单个地址(pages/address/add)
    getone:URL+'/pgg/address/getone',
    // 修改地址(pages/address/ad_details)
    update:URL+'/pgg/address/update',
    // 添加购物车(pages/course/course)
    addcart:URL+'/pgg/cart/addcart',
    // 修改购物车数量(pages/cart/cart)
    setnum:URL+'/pgg/cart/setnum',
    // 删除购物车(pages/cart/cart)
    delcart:URL+'/pgg/cart/delcart',
    // 购物车列表(pages/cart/cart)
    cartlist:URL+'/pgg/cart/cartlist',
    // 确认订单
    confirm:URL+'/pgg/order/confirm',
    // 创建订单 
    createorder:URL+'/pgg/order/createorder',
    // 订单列表(pages/myorder/myorder)
    orderlist:URL+'/pgg/order/orderlist',
    // 订单详情(pages/orderinfo/orderinfo)
    details:URL+'/pgg/order/details',
    // 取消订单(pages/orderinfo/orderinfo,pages/myorder/myorder)
    cancel:URL+'/pgg/order/cancel',
    // 我的分销(pages/fenxiao/fenxiao)
    myfx:URL+'/pgg/fenxiao/myfx',
    // 分销订单(pages/fx_order/fx_order)
    fxorder:URL+'/pgg/fenxiao/fxorder', 
    // 提现明细(pages/tixian/txlist)
    txlist:URL+'/pgg/fenxiao/txlist',
    // 申请提现(pages/applytx/applytx)
    applytx:URL+'/pgg/fenxiao/applytx',
    // 代理申请
    dlapply:URL+'/pgg/fenxiao/dlapply',
    // 评论列表
    pllist:URL+'/pgg/course/pllist',
    // 申请退款
    refund:URL+'/pgg/order/refund',
    // 添加评论
    addpl:URL+'/pgg/course/addpl',
    // 课程码
    coursecode:URL+'/pgg/course/coursecode',
    // 用户注册
    register:URL+'/pgg/user/register',
    // 用户登录
    login:URL+'/pgg/user/login',
    // 订单支付
    pay:URL+'/pgg/order/pay',
    // 绑定课程列表
    bindlist:URL+'/pgg/course/bindlist',
    // 绑定课程
    bind:URL+'/pgg/course/bind',
    // 目录详情
    courseCatalogDetail:URL+'/pgg/course/courseCatalogDetail',
    // 作业列表
    coursecatalogtask:URL+'/pgg/course/coursecatalogtask',
    // 提交作业
    settask:URL+'/pgg/course/settask',
    // banner
    banner:URL+'/pgg/user/banner',
    // 关于我们
    getconfig:URL+'/pgg/user/getconfig',
    // 直播预告
    notice:URL+'/pgg/user/notice',
    // 视频作品
    opus:URL+'/pgg/user/opus',
    // 确认收货
    complete:URL+'/pgg/order/complete',
    // 分享二维码
    courseQrcode:URL+'/pgg/wx/courseQrcode',
    // 续费
    payxf:URL+'/pgg/course/pay',
    // 下载
    upload:'https://wx.pingaogao.cn/api/pgg/upload/uploads',
    // 视频列表详情
    opusdetail:URL+'/pgg/user/opusdetail',
    // 显示优惠券
    iscoupons:URL+'/pgg/coupons/iscoupons',
    // 栏目
    lanmu:URL+'/pgg/user/lanmu',
    // 直播
    getlist:URL+'/pgg/wxlive/getlist'
} 