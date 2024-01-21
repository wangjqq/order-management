import apiService from '.';

export const getFileTree = async (params: any) => {
  return await apiService.get('/file/fileDirTree', { params });
};

export const getFiles = async (params: any) => {
  return await apiService.get('/file/filesList', { params });
};

export const deleteFile = async (data: any) => {
  return await apiService.post('/file/deleteFile', data);
};

export const download = async (params: any) => {
  return await apiService.get('/file/download', { params });
};
export const addFileTree = async (data: any) => {
  return await apiService.post('/file/createFolder', data);
};

export const createFolder = async (data: any) => {
  return await apiService.post('/file/createFolder', data);
};

export const delFolder = async (data: any) => {
  return await apiService.post('/file/delFolder', data);
};

export const upload = async (data: any, onUploadProgress: any) => {
  return await apiService.post('/file/upload', data, {
    timeout: 0, // 设置超时时间
    onUploadProgress,
  });
};
