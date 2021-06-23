// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from '/Users/zhangxiaotian/github/my/umiKeepalive2/node_modules/_@umijs_runtime@3.5.0-beta.8@@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts' */'@/layouts')}),
    "routes": [
      {
        "path": "/",
        "redirect": "/home",
        "exact": true
      },
      {
        "path": "/detail",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__detail' */'@/pages/detail')}),
        "exact": true
      },
      {
        "path": "/tagList",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__tagList' */'@/pages/tagList')}),
        "exact": true
      },
      {
        "path": "/home",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__home' */'@/pages/home')}),
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

  return routes;
}
