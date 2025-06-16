import axios from 'axios';
import { InventoryItem } from '../types/InventoryItem';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

export const deleteInventoryItem = (id: number) =>
  axios.delete(`${API_URL}/inventory/${id}`);

export const updateInventoryQuantity = (id: number, quantity: number) =>
  axios.patch(`${API_URL}/inventory/${id}`, { quantity });

export const updateInventoryItem = (id: number, data: Partial<InventoryItem>) =>
  axios.patch(`${API_URL}/inventory/${id}`, data);

export const createInventoryItem = (data: Partial<InventoryItem>) =>
  axios.post<InventoryItem>(`${API_URL}/inventory`, data);
