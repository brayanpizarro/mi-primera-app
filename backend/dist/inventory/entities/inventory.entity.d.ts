export declare class Inventory {
    id: number;
    name: string;
    description?: string;
    location: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    customAttributes?: Record<string, any>;
    createdAt: Date;
}
