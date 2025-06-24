import { InventoryAttribute } from './inventory-attribute.entity';
export declare class Inventory {
    id: number;
    name: string;
    description?: string;
    location: string;
    price: number;
    quantity: number;
    status: string;
    imageUrl?: string;
    attributes: InventoryAttribute[];
    createdAt: Date;
}
