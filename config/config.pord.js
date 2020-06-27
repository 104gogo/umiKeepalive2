'use strict';

module.exports = (appInfo) => {
  const config = (exports = {});

  config.assets = {
    publicPath: '/public/',
  };

  return config;
};
