export declare class Inventory {
    id: number;
    name: string;
    description?: string;
    location: string;
    price: number;
    quantity: number;
    status: string;
    customAttributes?: Record<string, any>;
    imageUrl?: string;
    createdAt: Date;
}
