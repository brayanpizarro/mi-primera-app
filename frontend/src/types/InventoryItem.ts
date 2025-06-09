export interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  location: string;
  price: number;
  quantity: number;
  createdAt: string; 
  imageUrl?: string;
}
