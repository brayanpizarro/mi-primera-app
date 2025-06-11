export interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  location: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: string; 
  imageUrl?: string;
  customAttributes?: Record<string, string>;
}
