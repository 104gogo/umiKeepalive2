// @ts-nocheck
import { Plugin } from '/Users/yunfenqiu/github/my/umiKeepalive2/node_modules/@umijs/runtime';

const plugin = new Plugin({
  validKeys: ['patchRoutes','rootContainer','render','onRouteChange','ssr','getInitialState','request',],
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
plugin.register({
  apply: require('/Users/yunfenqiu/github/my/umiKeepalive2/app/web/.umi/plugin-helmet/runtime.ts'),
  path: '/Users/yunfenqiu/github/my/umiKeepalive2/app/web/.umi/plugin-helmet/runtime.ts',
});

export { plugin };
