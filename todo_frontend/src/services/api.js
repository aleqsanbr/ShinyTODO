import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
    me: () => api.get('/auth/me')
};

export const tasksAPI = {
    getAll: (params = {}) => api.get('/tasks', { params }),
    getOne: (id) => api.get(`/tasks/${id}`),
    create: (task) => api.post('/tasks', { task }),
    update: (id, task) => api.put(`/tasks/${id}`, { task }),
    delete: (id) => api.delete(`/tasks/${id}`),
    toggleComplete: (id) => api.patch(`/tasks/${id}/toggle_complete`),
    search: (query) => api.get('/tasks/search', { params: { q: query } })
};

export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    create: (category) => api.post('/categories', { category }),
    update: (id, category) => api.put(`/categories/${id}`, { category }),
    delete: (id) => api.delete(`/categories/${id}`)
};

export default api;