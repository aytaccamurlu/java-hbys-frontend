import axios from 'axios';

// Render'daki Java backend adresin
const API_URL = "https://java-hbys-backend.onrender.com";

export const patientService = {
    // Başına ${API_URL} eklendi
    getAll: () => axios.get(`${API_URL}/api/patients`),
    create: (data) => axios.post(`${API_URL}/api/patients`, data),
    update: (id, data) => axios.put(`${API_URL}/api/patients/${id}`, data),
    delete: (id) => axios.delete(`${API_URL}/api/patients/${id}`)
};

export const appointmentService = {
    getAll: () => axios.get(`${API_URL}/api/appointments`),
    create: (data) => axios.post(`${API_URL}/api/appointments`, data),
    updateStatus: (id, status) => axios.patch(`${API_URL}/api/appointments/${id}/status`, { status }),
    delete: (id) => axios.delete(`${API_URL}/api/appointments/${id}`)
};

export const authService = {
    // Burada hem ${API_URL} ekledik hem de /api/ ekini Java backend yapına göre düzenledik
    login: (credentials) => axios.post(`${API_URL}/api/login`, credentials),
    register: (userData) => axios.post(`${API_URL}/api/register`, userData)
};