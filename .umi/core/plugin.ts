// @ts-nocheck
import { Plugin } from '/Users/yunfenqiu/github/my/umiKeepalive2/node_modules/@umijs/runtime';

const plugin = new Plugin({
  validKeys: ['patchRoutes','rootContainer','render','onRouteChange','getInitialState','request',],
});
plugin.register({
  apply: require('/Users/yunfenqiu/github/my/umiKeepalive2/app.js'),
  path: '/Users/yunfenqiu/github/my/umiKeepalive2/app.js',
});
plugin.register({
  apply: require('../plugin-keep-alive/runtime'),
  path: '../plugin-keep-alive/runtime',
});
plugin.register({
  apply: require('../plugin-initial-state/runtime'),
  path: '../plugin-initial-state/runtime',
});
plugin.register({
  apply: require('../plugin-model/runtime'),
  path: '../plugin-model/runtime',
});

export { plugin };
