// @ts-nocheck
import { ApplyPluginsType } from '/Users/yunfenqiu/github/my/umiKeepalive2/node_modules/@umijs/runtime';
import { plugin } from './plugin';

const routes = [
  {
    "path": "/",
    "component": require('@/layouts').default,
    "routes": [
      {
        "path": "/home/detail",
        "component": require('@/pages/detail').default,
        "exact": true
      },
      {
        "path": "/home",
        "component": require('@/pages/home').default,
        "exact": true
      }
    ]
  }
];

// allow user to extend routes
plugin.applyPlugins({
  key: 'patchRoutes',
  type: ApplyPluginsType.event,
  args: { routes },
});

export { routes };
