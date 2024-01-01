import apiService from '.';

export const getProducts = async (params: any) => {
  return await apiService.get('/product/getProducts', { params });
};

export const createProduct = async (data: any) => {
  return await apiService.post('/product/createProduct', data);
};
