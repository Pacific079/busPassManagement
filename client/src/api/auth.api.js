import api from './axiosInstance';

export const register = (data) => api.post('/auth/register', data).then(r => r.data.data);
export const login    = (data) => api.post('/auth/login',    data).then(r => r.data.data);
export const getMe    = ()     => api.get('/auth/me').then(r => r.data.data);
export const updateProfile  = (data) => api.put('/auth/profile', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
}).then(r => r.data.data);
export const changePassword = (data) => api.post('/auth/change-password', data).then(r => r.data);
