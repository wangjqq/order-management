import apiService from '.';

export const getOrders = async (params: any) => {
  return await apiService.get('/order/getOrders', { params });
};

export const createOrder = async (data: any) => {
  return await apiService.post('/order/createOrder', data);
};
