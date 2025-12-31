import axios from 'axios';

const API_URL = "https://java-hbys-backend.onrender.com";

export const patientService = {
    getAll: () => axios.get(`/api/patients`),
    create: (data) => axios.post(`/api/patients`, data),
    update: (id, data) => axios.put(`/api/patients/${id}`, data),
    delete: (id) => axios.delete(`/api/patients/${id}`)
};
export const appointmentService = {
    getAll: () => axios.get('/api/appointments'),
    create: (data) => axios.post('/api/appointments', data),
    updateStatus: (id, status) => axios.patch(`/api/appointments/${id}/status`, { status }),
    delete: (id) => axios.delete(`/api/appointments/${id}`)
};
export const authService = {
    login: (credentials) => axios.post(`${API_URL}/login`, credentials),
    register: (userData) => axios.post(`${API_URL}/register`, userData)
};