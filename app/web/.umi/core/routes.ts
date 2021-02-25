// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/Users/zhangxiaotian/github/my/umiKeepalive2/node_modules/_@umijs_runtime@3.3.9@@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": require('@/layouts').default,
    "routes": [
      {
        "path": "/",
        "redirect": "/home",
        "exact": true
      },
      {
        "path": "/detail",
        "component": require('@/pages/detail').default,
        "exact": true
      },
      {
        "path": "/tagList",
        "component": require('@/pages/tagList').default,
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

  return routes;
}
