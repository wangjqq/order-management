import apiService from '.';

export const getFileTree = async () => {
  return await apiService.get('/file/fileTree');
};

export const upload = async (data: { file: string; password: string }) => {
  return await apiService.post('/user/login', data);
};
