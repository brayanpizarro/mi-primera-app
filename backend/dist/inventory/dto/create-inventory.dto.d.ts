import { InventoryAttributeDto } from './inventory-attribute.dto';
export declare class CreateInventoryDto {
    name: string;
    description?: string;
    location: string;
    price: number;
    quantity: number;
    status?: string;
    imageUrl?: string;
    attributes?: InventoryAttributeDto[];
}
