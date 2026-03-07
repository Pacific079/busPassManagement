import api from './axiosInstance';

export const applyPass   = (formData) => api.post('/pass/apply', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
}).then(r => r.data.data);

export const getMyPasses = (params) => api.get('/pass/my-passes', { params }).then(r => r.data.data);
export const getPassById = (id)     => api.get(`/pass/${id}`).then(r => r.data.data);
export const renewPass   = (id, data) => api.post(`/pass/${id}/renew`, data).then(r => r.data.data);
export const verifyPass  = (passNumber) => api.get(`/pass/verify/${passNumber}`).then(r => r.data.data);

export const getCategories = () => api.get('/public/categories').then(r => r.data.data);
export const getRoutes     = () => api.get('/public/routes').then(r => r.data.data);
