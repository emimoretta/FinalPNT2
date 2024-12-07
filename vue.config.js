const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/mercadolibre': {
        target: 'https://www.mercadolibre.com.ar',
        changeOrigin: true,
        pathRewrite: { '^/mercadolibre': '' },
      },
      '/mercadolibre2':{
        target: 'https://api.mercadolibre.com',
        changeOrigin: true,
        pathRewrite: {'^/mercadolibre2': ''},
      },
    },
  },
});