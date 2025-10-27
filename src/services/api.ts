import axios from 'axios';
import type { AuthResponse, Todo, CreateTodoDto, UpdateTodoDto } from '../types';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const { data } = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return data;
  },

  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', { email, password, name });
    return data;
  },

  getMe: async (): Promise<AuthResponse['user']> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

// Todos API
export const todosAPI = {
  getAll: async (): Promise<Todo[]> => {
    const { data } = await api.get('/todos/');
    return data;
  },

  create: async (todo: CreateTodoDto): Promise<Todo> => {
    const { data } = await api.post('/todos/', todo);
    return data;
  },

  update: async (id: string, todo: UpdateTodoDto): Promise<Todo> => {
    const { data } = await api.put(`/todos/${id}`, todo);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
};

export default api;
