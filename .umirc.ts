import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  // dynamicImport: { loading: '@/Loading' },
  layout: {
    title: '@umijs/max',
  },
  history: {
    type: 'hash',
  },
  lessLoader: {},
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    { path: '/login', component: './Login', layout: false },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '数据管理',
      path: '/dataManagement',
      // component: './DataManagement',
      routes: [
        {
          name: '订单管理',
          path: '/dataManagement/order',
          component: './Order',
        },
        {
          name: '商品管理',
          path: '/dataManagement/product',
          component: './Product',
        },
        {
          name: '顾客管理',
          path: '/dataManagement/customer',
          component: './Customer',
        },
        {
          name: '文件管理',
          path: '/dataManagement/file',
          component: './File',
        },
      ],
    },
    {
      name: '服务器管理',
      path: '/systemManagement',
      // component: './Home',
      routes: [
        {
          name: '服务器监控',
          path: '/systemManagement/monitor',
          component: './Monitor',
        },
        {
          name: '服务器信息',
          path: '/systemManagement/SystemInfo',
          component: './SystemInfo',
        },
      ],
    },
  ],
  npmClient: 'pnpm',
});
