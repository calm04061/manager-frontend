// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = ['js', 'css']

module.exports = {
  productionSourceMap: false,

  devServer: {
    proxy: {
      '/api': {
        changeOrigin: true,
        // target: 'http://manager.calm0406.com'
        target: 'http://127.0.0.1:8080', // 代理地址，这里设置的地址会代替axios中设置的baseURL
      },
    },
  },
  lintOnSave: false,

  transpileDependencies: ['vuetify'],
  configureWebpack: {
        plugins: [
            // new CompressionWebpackPlugin({
            //     filename: '[path].gz[query]',
            //     algorithm: 'gzip',
            //     test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            //     threshold: 0,
            //     minRatio: 0.8,
            // }),
        ],
        externals: {
        },
    },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
