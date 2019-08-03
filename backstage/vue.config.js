// 导出模块
module.exports = {
  // 部署应用包时的基本URL
  publicPath:'./',
  // 是否在开发环境下通过eslint-loader在每次保存时lint代码
  lintOnSave:false,
  devServer:{
    // 所有webpack-dev-server的选项都支持
    proxy:{
      // 前端应用和后端API服务器没有运行在同一个主机上，你需要在开发环境下将API请求代理到API服务器。
      '/api':{
        target:'http://47.107.167.164:8080',//目标主机
        ws:true,//代理的WebSockets
        changeOrigin:true,//需要虚拟主机站点（允许跨域）
        pathRewrite:{
          '^/api':''//'/api'替代target的内容,设置路径
        }
      }
    }
  }
}