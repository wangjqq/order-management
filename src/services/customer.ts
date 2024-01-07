import apiService from '.';

export const getCustomers = async (params: any) => {
  return await apiService.get('/customer/getCustomers', { params });
};

export const getCustomerAddresss = async (params: any) => {
  return await apiService.get('/customer/getCustomerAddresss', { params });
};
export const createCustomerAddress = async (data: any) => {
  return await apiService.post('/customer/createCustomerAddress', data);
};
export const createCustomer = async (data: any) => {
  return await apiService.post('/customer/createCustomer', data);
};
export const delCustomer = async (data: any) => {
  return await apiService.delete('/customer/delCustomer', data);
};
