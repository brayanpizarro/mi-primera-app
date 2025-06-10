import axios from 'axios';
import { InventoryItem } from '../types/InventoryItem';
import { getToken } from './authService';

const API_URL = 'http://localhost:3000/api/v1';

// Crear una instancia de axios con la configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getInventory = async (): Promise<InventoryItem[]> => {
  const response = await api.get('/inventory');
  return response.data;
};

export type CreateInventoryItemDTO = Omit<InventoryItem, 'id' | 'createdAt'>;
export type UpdateInventoryItemDTO = Partial<CreateInventoryItemDTO>;

export const addInventoryItem = async (
  item: CreateInventoryItemDTO
): Promise<InventoryItem> => {
  const response = await api.post('/inventory', item);
  return response.data;
};

export const updateInventoryItem = async (
  id: number,
  item: UpdateInventoryItemDTO
): Promise<InventoryItem> => {
  const response = await api.patch(`/inventory/${id}`, item);
  return response.data;
};

export const deleteInventoryItem = async (id: number): Promise<void> => {
  await api.delete(`/inventory/${id}`);
};
