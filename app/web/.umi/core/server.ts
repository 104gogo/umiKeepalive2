// @ts-nocheck
// umi.server.js
import '/Users/yunfenqiu/github/my/umiKeepalive2/node_modules/regenerator-runtime/runtime.js';
import { format } from 'url';
import renderServer from '/Users/yunfenqiu/github/my/umiKeepalive2/node_modules/@umijs/preset-built-in/lib/plugins/features/ssr/templates/renderServer/renderServer.js';
import { stripBasename, cheerio, handleHTML } from '/Users/yunfenqiu/github/my/umiKeepalive2/node_modules/@umijs/preset-built-in/lib/plugins/features/ssr/templates/utils.js';

import { ApplyPluginsType, createMemoryHistory } from '/Users/yunfenqiu/github/my/umiKeepalive2/node_modules/@umijs/runtime';
import { plugin } from './plugin';

// 主要为后面支持按需服务端渲染，单独用 routes 会全编译
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


// origin require module
// https://github.com/webpack/webpack/issues/4175#issuecomment-342931035
const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;

export interface IParams {
  path: string;
  htmlTemplate?: string;
  mountElementId?: string;
  context?: object
}

export interface IRenderResult<T> {
  rootContainer: T;
  html?: T;
  error?: Error;
}

export interface IRender<T = string> {
  (params: IParams): Promise<IRenderResult<T>>;
}

/**
 * server render function
 * @param params
 */
const render: IRender = async (params) => {
  let error;
  const {
    path,
    htmlTemplate = '',
    mountElementId = 'root',
    context = {},
    mode = 'string',
    basename = '/',
    staticMarkup = false,
    forceInitial = false,
    getInitialPropsCtx,
  } = params;
  let manifest = params.manifest;
  const env = 'development';

  let html = htmlTemplate || "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta\n      name=\"viewport\"\n      content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\"\n    />\n    <link rel=\"stylesheet\" href=\"http://localhost:8000/umi.css\" />\n    <script>\n      window.routerBase = \"/\";\n    </script>\n    <script src=\"http://localhost:8000/@@/devScripts.js\"></script>\n    <script>\n      //! umi version: 3.2.3\n    </script>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n\n    <script src=\"http://localhost:8000/umi.js\"></script>\n  </body>\n</html>\n";
  let rootContainer = '';
  try {
    // handle basename
    const location = stripBasename(basename, path);
    const { pathname } = location;
    // server history
    const history = createMemoryHistory({
      initialEntries: [format(location)],
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
    }
    const dynamicImport =  false;
    if (dynamicImport && !manifest) {
      try {
        // prerender not work because the manifest generation behind of the prerender
        manifest = requireFunc(`./`);
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
      html = await handleHTML({ html, rootContainer, pageInitialProps, mountElementId, mode, forceInitial, routesMatched, dynamicImport, manifest });
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
