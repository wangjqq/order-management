import apiService from '.';

export const checkUser = async () => {
  return await apiService.get('/user/checkUser');
};

export const login = async (data: { username: string; password: string }) => {
  return await apiService.post('/user/login', data);
};
