module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: './',

  indexPath: 'index.html',
  filenameHashing: true,
  productionSourceMap: false,
  pages: {
    index: {
      entry: './src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '没找酒店管理系统',
    }
  },
  lintOnSave: false,
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {// 为生产环境修改配置...
      config.mode = 'production';
      config["performance"] = {//打包文件大小配置
        "maxEntrypointSize": 10000000,
        "maxAssetSize": 30000000
      }
    }
  },


};

