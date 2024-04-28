const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/', // Configura a base URL para o ambiente de desenvolvimento

  chainWebpack: config => {
    config.devtool('source-map'); // Habilita a geração de sourcemaps

    config.plugin('define').tap(args => {
      args[0]['process.env'] = {
        ...args[0]['process.env'],
        // Define as flags de funcionalidades
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true),
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
      };
      return args;
    });
  },

  pluginOptions: {
    vuetify: {
      // Configurações do vuetify-loader, se necessário
    }
  }
});
