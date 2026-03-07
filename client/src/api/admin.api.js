import api from './axiosInstance';

export const getDashboard        = ()       => api.get('/admin/dashboard').then(r => r.data.data);
export const getApplications     = (params) => api.get('/admin/applications', { params }).then(r => r.data.data);
export const approveApplication  = (id)     => api.put(`/admin/applications/${id}/approve`).then(r => r.data);
export const rejectApplication   = (id, reason) => api.put(`/admin/applications/${id}/reject`, { reason }).then(r => r.data);
export const getAllPayments       = (params) => api.get('/admin/payments', { params }).then(r => r.data.data);
export const getAllUsers          = (params) => api.get('/admin/users', { params }).then(r => r.data.data);


export const getAdminCategories  = ()       => api.get('/admin/categories').then(r => r.data.data);
export const createCategory      = (data)   => api.post('/admin/categories', data).then(r => r.data.data);
export const updateCategory      = (id, d)  => api.put(`/admin/categories/${id}`, d).then(r => r.data.data);
export const deleteCategory      = (id)     => api.delete(`/admin/categories/${id}`).then(r => r.data);


export const getAdminRoutes      = ()       => api.get('/admin/routes').then(r => r.data.data);
export const createRoute         = (data)   => api.post('/admin/routes', data).then(r => r.data.data);
export const updateRoute         = (id, d)  => api.put(`/admin/routes/${id}`, d).then(r => r.data.data);
export const deleteRoute         = (id)     => api.delete(`/admin/routes/${id}`).then(r => r.data);
