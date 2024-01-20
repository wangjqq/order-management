import { message } from 'antd';
import axios from 'axios';
import { history } from 'umi';

const apiService = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000',
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
apiService.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 比如可以在请求头中添加 token 等
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 响应拦截器
apiService.interceptors.response.use(
  ({ data }) => {
    // 对响应数据做些什么
    if (data.code === 401) {
      // 跳转到登录页
      message.error(data.msg);
      history.push('/login');
      return Promise.reject();
    } else if (data.code === 400) {
      message.error(data.msg);
      return Promise.reject();
    } else if (data.code === 500) {
      message.error(data.msg);
      return Promise.reject();
    }
    return data;
  },
  (error) => {
    message.error('系统异常 ' + error.message);
    return Promise.reject(error);
  },
);

export default apiService;
