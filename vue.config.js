// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          "primary-color": "#ffd500",
          "link-color": "#ffd500",
          "border-radius-base": "2px"
        },
        javascriptEnabled: true
      }
    }
  }
};
