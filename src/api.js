import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/inventory/api'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDevices = () => api.get('/devices/');
export const fetchDevice = (id) => api.get(`/devices/${id}/`);
export const createDevice = (data) => api.post('/devices/', data);
export const updateDevice = (id, data) => api.put(`/devices/${id}/`, data);
export const deleteDevice = (id) => api.delete(`/devices/${id}/`);

export const fetchEmployees = () => api.get('/employees/');
export const fetchEmployee = (id) => api.get(`/employees/${id}/`);
export const createEmployee = (data) => api.post('/employees/', data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}/`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}/`);

export const fetchAssignments = () => api.get('/assignments/');
export const fetchAssignment = (id) => api.get(`/assignments/${id}/`);
export const createAssignment = (data) => api.post('/assignments/', data);
export const updateAssignment = (id, data) => api.put(`/assignments/${id}/`, data);
export const deleteAssignment = (id) => api.delete(`/assignments/${id}/`);
