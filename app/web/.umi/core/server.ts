// @ts-nocheck
// umi.server.js
import '/Users/zhangxiaotian/github/my/umiKeepalive2/node_modules/_regenerator-runtime@0.13.5@regenerator-runtime/runtime.js';
import { format } from 'url';
import renderServer from '/Users/zhangxiaotian/github/my/umiKeepalive2/node_modules/_@umijs_preset-built-in@3.5.0-beta.8@@umijs/preset-built-in/lib/plugins/features/ssr/templates/renderServer/renderServer.js';
import { stripBasename, cheerio, handleHTML } from '/Users/zhangxiaotian/github/my/umiKeepalive2/node_modules/_@umijs_preset-built-in@3.5.0-beta.8@@umijs/preset-built-in/lib/plugins/features/ssr/templates/utils.js';
import { IServerRender } from '@umijs/types';

import { ApplyPluginsType, createMemoryHistory, dynamic } from '/Users/zhangxiaotian/github/my/umiKeepalive2/node_modules/_@umijs_runtime@3.5.0-beta.8@@umijs/runtime';
import { plugin } from './plugin';
import './pluginRegister';

// origin require module
// https://github.com/webpack/webpack/issues/4175#issuecomment-342931035
const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;

/**
 * server render function
 * @param params
 */
const render: IServerRender = async (params) => {
  let error;
  const {
    origin = '',
    path,
    htmlTemplate = '',
    mountElementId = 'root',
    context = {},
    mode = 'string',
    basename = '/',
    staticMarkup = false,
    forceInitial = false,
    removeWindowInitialProps = false,
    getInitialPropsCtx,
  } = params;
  let manifest = params.manifest;
  const env = 'development';

  let html = htmlTemplate || "\u003C!DOCTYPE html\u003E\n\u003Chtml\u003E\n  \u003Chead\u003E\n    \u003Cmeta charset=\"utf-8\" \u002F\u003E\n    \u003Cmeta\n      name=\"viewport\"\n      content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\"\n    \u002F\u003E\n    \u003Clink rel=\"stylesheet\" href=\"http:\u002F\u002Flocalhost:8000\u002Fumi.css\" \u002F\u003E\n    \u003Cscript\u003E\n      window.routerBase = \"\u002F\";\n    \u003C\u002Fscript\u003E\n    \u003Cscript src=\"http:\u002F\u002Flocalhost:8000\u002F@@\u002FdevScripts.js\"\u003E\u003C\u002Fscript\u003E\n    \u003Cscript\u003E\n      \u002F\u002F! umi version: 3.5.0-beta.8\n    \u003C\u002Fscript\u003E\n  \u003C\u002Fhead\u003E\n  \u003Cbody\u003E\n    \u003Cdiv id=\"root\"\u003E\u003C\u002Fdiv\u003E\n\n    \u003Cscript src=\"http:\u002F\u002Flocalhost:8000\u002Fumi.js\"\u003E\u003C\u002Fscript\u003E\n  \u003C\u002Fbody\u003E\n\u003C\u002Fhtml\u003E\n";
  let rootContainer = '';
  try {
    // handle basename
    const location = stripBasename(basename, `${origin}${path}`);
    const { pathname } = location;
    // server history
    const history = createMemoryHistory({
      initialEntries: [format(location)],
    });
    /**
     * beforeRenderServer hook, for polyfill global.*
     */
    await plugin.applyPlugins({
      key: 'ssr.beforeRenderServer',
      type: ApplyPluginsType.event,
      args: {
        env,
        path,
        context,
        history,
        mode,
        location,
      },
      async: true,
    });

    /**
     * routes init and patch only once
     * beforeRenderServer must before routes init avoding require error
     */
    // 主要为后面支持按需服务端渲染，单独用 routes 会全编译
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
        "exact": true,
        "_chunkName": "p__detail"
      },
      {
        "path": "/tagList",
        "component": require('@/pages/tagList').default,
        "exact": true,
        "_chunkName": "p__tagList"
      },
      {
        "path": "/home",
        "component": require('@/pages/home').default,
        "exact": true,
        "_chunkName": "p__home"
      }
    ],
    "_chunkName": "layouts"
  }
];
    // allow user to extend routes
    plugin.applyPlugins({
      key: 'patchRoutes',
      type: ApplyPluginsType.event,
      args: { routes },
    });

    // for renderServer
    const opts = {
      path,
      history,
      pathname,
      getInitialPropsCtx,
      basename,
      context,
      mode,
      plugin,
      staticMarkup,
      routes,
      isServer: process.env.__IS_SERVER,
    }
    const dynamicImport =  true;
    if (dynamicImport && !manifest) {
      try {
        // prerender not work because the manifest generation behind of the prerender
        manifest = requireFunc(`./asset-manifest.json`);
      } catch (_) {}
    }
    // renderServer get rootContainer
    const { pageHTML, pageInitialProps, routesMatched } = await renderServer(opts);
    rootContainer = pageHTML;
    if (html) {
      // plugin for modify html template
      html = await plugin.applyPlugins({
        key: 'ssr.modifyServerHTML',
        type: ApplyPluginsType.modify,
        initialValue: html,
        args: {
          context,
          cheerio,
          routesMatched,
          dynamicImport,
          manifest
        },
        async: true,
      });
      html = await handleHTML({ html, rootContainer, pageInitialProps, mountElementId, mode, forceInitial, removeWindowInitialProps, routesMatched, dynamicImport, manifest });
    }
  } catch (e) {
    // downgrade into csr
    error = e;
  }
  return {
    rootContainer,
    error,
    html,
  }
}

export default render;
