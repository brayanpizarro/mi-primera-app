import axios from 'axios';
import { InventoryItem } from '../types/InventoryItem';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getInventory = () =>
  axios.get<InventoryItem[]>(`${API_URL}/inventory`);

export const deleteInventoryItem = (id: number) =>
  axios.delete(`${API_URL}/inventory/${id}`);

export const updateInventoryQuantity = (id: number, quantity: number) =>
  axios.patch(`${API_URL}/inventory/${id}`, { quantity });

export const updateInventoryItem = (id: number, data: Partial<InventoryItem>) =>
  axios.patch(`${API_URL}/inventory/${id}`, data);

export const createInventoryItem = (data: Partial<InventoryItem>) =>
  axios.post<InventoryItem>(`${API_URL}/inventory`, data);
