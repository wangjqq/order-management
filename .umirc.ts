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
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '订单管理',
      path: '/order',
      component: './Order',
    },
    {
      name: '客户管理',
      path: '/customer',
      component: './Customer',
    },
  ],
  npmClient: 'pnpm',
});
