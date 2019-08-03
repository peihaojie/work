import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 指定模块的默认输出
export default new Router({
  base:process.env.BASE_URL, //基本路径，值使用config中定义的baseUrl
  routes:[
    {
      path:'/', // 自定义的路由路径名，可以随意定制
      name:'login',
      component:() => import('@/views/login')  // @等价于/src这个目录
    },
    {
      path:'/index',
      name:'index',
      component:resolve => {require(['@/views/index'],resolve)}, //这个特殊的`require`语法将会告诉webpack,自动将你的构建代码切割成多个包，这些包会通过Ajax请求加载
      redirect:'/index/systemIndex', //重定向：当用户访问/index时，URL将会被替换成/index/systemIndex，然后匹配路由为/index/systemIndex
      children:[ //二级路由
        {
          path:'/index/systemIndex', //系统首页
          name:'systemIndex',
          component:resolve => {require(['@/views/index/systemIndex'],resolve)}
        },
        {
          path:'/index/accountSetting', //账户设置
          name:'accountSetting',
          component:resolve => {require(['@/views/index/accountSetting'],resolve)}
        },
        {
          path:'/index/systemInfo', //系统信息
          name:'systemInfo',
          component:resolve => {require(['@/views/index/systemInfo'],resolve)}
        },
        {
          path: '/goods/list',   //商品列表
          name: 'goodsList',
          component: resolve => { require(['@/views/goods/list'], resolve) },
        },
        {
          path: '/goods/add',  //添加商品
          name: 'add',
          component: resolve => { require(['@/views/goods/add'], resolve) },
        },
        {
          path: '/goods/recycle',  //商品回收站
          name: 'recycle',
          component: resolve => { require(['@/views/goods/recycle'], resolve) },
        },
        {
          path: '/goods/comment',  //商品评价
          name: 'comment',
          component: resolve => { require(['@/views/goods/comment'], resolve) },
        },
        {
          path: '/goods/comment/detail',   //商品详情
          name: 'commentDetail',
          component: resolve => { require(['@/views/goods/commentDetail'], resolve) },
        },
        {
          path: '/goods/category',   //商品分类
          name: 'category',
          component: resolve => { require(['@/views/goods/category'], resolve) },
        },
        {
          path: '/goods/category/addCategory',   //添加商品分类
          name: 'addCategory',
          component: resolve => { require(['@/views/goods/addCategory'], resolve) },
        },
        {
          path: '/goods/type',   //商品类型
          name: 'type',
          component: resolve => { require(['@/views/goods/type'], resolve) },
        },
        {
          path: '/goods/type/prop/:id',   //商品类型属性
          name: 'prop',
          component: resolve => { require(['@/views/goods/prop'], resolve) },
        },
        {
          path: '/goods/type/addProp',   //添加商品类型属性
          name: 'addProp',
          component: resolve => { require(['@/views/goods/addProp'], resolve) },
        },
        {
          path: '/goods/type/params/:id',   //商品参数列表
          name: 'params',
          component: resolve => { require(['@/views/goods/params'], resolve) },
        },
        {
          path: '/goods/type/addParams',   //添加商品参数
          name: 'addParams',
          component: resolve => { require(['@/views/goods/addParams'], resolve) },
        },
        {
          path: '/goods/brand', //商品品牌
          name: 'brand',
          component: resolve => { require(['@/views/goods/brand'], resolve) },
        },
        {
          path: '/goods/brand/addBrand', //添加商品品牌
          name: 'addBrand',
          component: resolve => { require(['@/views/goods/addBrand'], resolve) },
        },
        {
          path: '/goods/image', //商品图片库
          name: 'image',
          component: resolve => { require(['@/views/goods/image'], resolve) },
        },
        {
          path: '/goods/image/addImage', //添加商品图片库
          name: 'addImage',
          component: resolve => { require(['@/views/goods/addImage'], resolve) },
        },
        {
          path: '/goods/image/:id', //相册图片列表
          name: 'imageList',
          component: resolve => { require(['@/views/goods/imageList'], resolve) },
        },
        {
          path: '/order/list',//订单列表
          name: 'list',
          component: resolve => { require(['@/views/order/list'], resolve) },
        },
        {
          path: "/order/receipt",//确认收货
          name: 'receipt',
          component: resolve => { require(['@/views/order/receipt'], resolve) },
        },
        {
          path: "/order/orderSeting",//订单设置
          name: 'orderSeting',
          component: resolve => { require(['@/views/order/orderSeting'], resolve) },
        },
        {
          path: "/order/returnGoods",//退货
          name: 'returnGoods',
          component: resolve => { require(['@/views/order/returnGoods'], resolve) },
        },
        {
          path: "/order/refund",//退款
          name: 'refund',
          component: resolve => { require(['@/views/order/refund'], resolve) },
        },
        {
          path: "/order/returnCause",//退货原因
          name: 'returnCause',
          component: resolve => { require(['@/views/order/returnCause'], resolve) },
        },
        {
          path: "/order/address",//退货点
          name: 'address',
          component: resolve => { require(['@/views/order/address'], resolve) },
        },
        {
          path: "/order/address/addAddress",//添加退货点
          name: 'addAddress',
          component: resolve => { require(['@/views/order/addAddress'], resolve) },
        },
        {
          path: "/promotion/header",//头部列表
          name: 'header',
          component: resolve => { require(['@/views/promotion/header'], resolve) },
        },
        {
          path: "/promotion/addHeader",//添加头部
          name: 'addHeader',
          component: resolve => { require(['@/views/promotion/addHeader'], resolve) },
        },
        {
          path: "/promotion/list",//拼团商品列表
          name: 'promotionList',
          component: resolve => { require(['@/views/promotion/list'], resolve) },
        },
        {
          path: "/promotion/addGoods",//添加拼团商品
          name: 'addGoods',
          component: resolve => { require(['@/views/promotion/addGoods'], resolve) },
        },
        {
          path: "/promotion/groupList",//成团管理
          name: 'groupList',
          component: resolve => { require(['@/views/promotion/groupList'], resolve) },
        },
        {
          path: "/promotion/groupOrder",//拼团订单
          name: 'groupOrder',
          component: resolve => { require(['@/views/promotion/groupOrder'], resolve) },
        },
        {
          path: "/stock/in", //商品入库
          name: 'stockIn',
          component: resolve => { require(['@/views/stock/stockIn'], resolve) },
        },
        {
          path: "/stock/out", //商品出库
          name: 'stockOut',
          component: resolve => { require(['@/views/stock/stockOut'], resolve) },
        },
        {
          path: "/user/list",  //用户列表
          name: 'userList',
          component: resolve => { require(['@/views/user/list'], resolve) },
        },
        {
          path: "/user/list/info/:id",  //用户列表
          name: 'userInfo',
          component: resolve => { require(['@/views/user/info'], resolve) },
        },
        {
          path: "/operate/advertising", //广告列表
          name: 'advertising',
          component: resolve => { require(['@/views/operate/advertising'], resolve) },
        },
        {
          path: "/operate/addAdvertising", //添加广告
          name: 'addAdvertising',
          component: resolve => { require(['@/views/operate/addAdvertising'], resolve) },
        },
        {
          path: "/statistics/deal", //交易统计
          name: 'deal',
          component: resolve => { require(['@/views/statistics/deal'], resolve) },
        },
        // {
        //   path: "/statistics/goods", //商品统计
        //   name: 'statisticsGoods',
        //   component: resolve => { require(['@/views/statistics/goods'], resolve) },
        // },
        // {
        //   path: "/statistics/search", //搜索统计
        //   name: 'search',
        //   component: resolve => { require(['@/views/statistics/search'], resolve) },
        // },
        // {
        //   path: "/order/refund/refundDetail",//退款详情
        //   name: 'refundDetail',
        //   component: resolve => { require(['@/views/order/refundDetail'], resolve) },
        // },
        // {
        //   path: "/order/returnGoods/returnGoodsDetail",//退货详情
        //   name: 'returnGoodsDetail',
        //   component: resolve => { require(['@/views/order/returnGoodsDetail'], resolve) },
        // },
        {
          path: "/order/list/orderDetail",//订单详情
          name: 'orderDetail',
          component: resolve => { require(['@/views/order/orderDetail'], resolve) },
        },
        // {
        //   path: "/setup/logistics",//物流追踪
        //   name: 'logistics',
        //   component: resolve => { require(['@/views/setup/logistics'], resolve) },
        // }, 
        // {
        //   path: "/setup/regional",//区域设置
        //   name: 'regional',
        //   component: resolve => { require(['@/views/setup/regional'], resolve) },
        // },
        {
          path: "/authority/authority",//区域设置authority
          name: 'authority',
          component: resolve => { require(['@/views/authority/authority'], resolve) },
        }
      ]
    }
  ]
})