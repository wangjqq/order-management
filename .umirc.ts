import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
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
          name: '客户管理',
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
  ],
  npmClient: 'pnpm',
});
