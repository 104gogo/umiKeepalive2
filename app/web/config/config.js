import path from 'path';
import { defineConfig } from 'umi';

export default defineConfig({
  title: false,
  routes: [
    {
      path: `/`,
      component: '@/layouts',
      routes: [
        { path: '/', redirect: '/home' },
        { path: '/detail', component: '@/pages/detail' },
        { path: '/tagList', component: '@/pages/tagList' },
        { path: '/home', component: '@/pages/home' },
      ]
    },
  ],
  alias: {
    '@': path.resolve(__dirname, '../../web'),
  },
  devServer: {
    public: path.resolve(__dirname, '../public'),
  },
  ssr: {
    devServerRender: true,
  },
  outputPath: '../public',
  publicPath: 'http://localhost:8000/',
  targets: false,
  autoprefixer: false,
  // targets: { chrome: 40, ie: 11 },
  layout: false,
  nodeModulesTransform: {
    type: 'none', // node_modules 下的文件不走 babel 编译
    exclude: [],
  },
});
