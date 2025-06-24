import axios from 'axios';
import { InventoryItem, InventoryAttribute } from '../types/InventoryItem';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Configurar interceptor para incluir el token automáticamente
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getInventory = (
  page = 1,
  limit = 10,
  search = '',
  location = '',
  status = '',
  sort = 'createdAt',
  direction: 'DESC' | 'ASC' = 'DESC'
) => {
  return axios.get<{ data: InventoryItem[]; total: number; page: number; totalPages: number }>(
    `${API_URL}/inventory`,
    {
      params: {
        page,
        limit,
        filter: search,        
        location,              
        status,                
        sort,
        direction,
      },
    }
  );
};

export const getInventoryLocations = () => {
  return axios.get<string[]>(`${API_URL}/inventory/locations`);
};

export const getInventoryStatuses = () => {
  return axios.get<string[]>(`${API_URL}/inventory/statuses`);
};

export const getInventoryAttributeKeys = () => {
  return axios.get<string[]>(`${API_URL}/inventory/attributes`);
};

export const getInventoryAttributeValues = (key: string) => {
  return axios.get<string[]>(`${API_URL}/inventory/attributes/${key}`);
};

export const getInventoryCount = () => {
  return axios.get(`${API_URL}/inventory/count`);
};

export const healthCheck = () => {
  return axios.get(`${API_URL}/inventory/health`);
};

export const findInventoryByAttribute = (key: string, value: string) => {
  return axios.get<InventoryItem[]>(`${API_URL}/inventory/attributes/${key}`, {
    params: { value }
  });
};

export const deleteInventoryItem = (id: number) =>
  axios.delete(`${API_URL}/inventory/${id}`);

export const updateInventoryQuantity = (id: number, quantity: number) =>
  axios.patch(`${API_URL}/inventory/${id}`, { quantity });

export const updateInventoryItem = (id: number, data: Partial<InventoryItem>) =>
  axios.patch(`${API_URL}/inventory/${id}`, data);

export const createInventoryItem = (data: Partial<InventoryItem>) =>
  axios.post<InventoryItem>(`${API_URL}/inventory`, data);
