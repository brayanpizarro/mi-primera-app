export interface InventoryAttribute {
  id: number;
  key: string;
  value: string;
}

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
  attributes: InventoryAttribute[];
}
