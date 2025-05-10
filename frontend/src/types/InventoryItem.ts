export interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  location: string;
  price: number;
  quantity: number;
  createdAt: string; // viene como string ISO desde la API
}
