import apiService from '.';

export const queryOsData = async (params?: any) => {
  return await apiService.get('/system/queryOsData', { params });
};
