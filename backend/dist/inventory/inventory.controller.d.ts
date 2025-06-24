import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    healthCheck(): Promise<{
        status: string;
        message: string;
        totalItems: number;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
        totalItems?: undefined;
    }>;
    create(dto: CreateInventoryDto): Promise<import("./entities/inventory.entity").Inventory | null>;
    findAll(filter?: string, page?: string, limit?: string, location?: string, status?: string, sort?: string, direction?: 'ASC' | 'DESC'): Promise<{
        data: import("./entities/inventory.entity").Inventory[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("./entities/inventory.entity").Inventory | null>;
    update(id: string, dto: UpdateInventoryDto): Promise<import("./entities/inventory.entity").Inventory | null>;
    remove(id: string): Promise<import("./entities/inventory.entity").Inventory>;
    getCount(): Promise<{
        total: number;
    }>;
    getLocations(): Promise<string[]>;
    getStatuses(): Promise<string[]>;
    getAttributeKeys(): Promise<string[]>;
    findByAttribute(key: string, value: string): Promise<string[] | import("./entities/inventory.entity").Inventory[]>;
}
