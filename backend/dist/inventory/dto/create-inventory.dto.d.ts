export declare class CreateInventoryDto {
    name: string;
    description?: string;
    location: string;
    price: number;
    quantity: number;
    status: string;
    imageUrl?: string;
    customAttributes?: Record<string, any>;
}
