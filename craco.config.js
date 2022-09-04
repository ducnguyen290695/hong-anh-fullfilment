const CracoLessPlugin = require('craco-less');

module.exports = {
  eslint: {
    enable: false,
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#1953D8',
              '@height-base': '40px',
              '@border-radius-base': '8px',
              '@menu-icon-size': '20px',
              '@menu-item-active-border-width': '8px',
              '@checkbox-border-radius': '2px',
              '@collapse-content-padding': '0px',
              '@collapse-content-bg': '#F7F8FB',
              '@collapse-header-padding': '10px 15px 5px 15px',
              '@table-border-radius-base': '0px',
              '@collapse-content-bg': '#ffffff',
              '@collapse-header-padding': '20px',
              '@collapse-header-bg': '#f7f8fb',
              '@tree-bg': '#f7f8fb',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
