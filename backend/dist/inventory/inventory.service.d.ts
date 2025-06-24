import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryAttribute } from './entities/inventory-attribute.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryService {
    private readonly inventoryRepo;
    private readonly attributeRepo;
    constructor(inventoryRepo: Repository<Inventory>, attributeRepo: Repository<InventoryAttribute>);
    create(dto: CreateInventoryDto): Promise<Inventory | null>;
    findAllPaginated(search: string | undefined, page: number, limit: number, location?: string, status?: string, sort?: string, direction?: 'ASC' | 'DESC'): Promise<{
        data: Inventory[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Inventory | null>;
    update(id: number, dto: UpdateInventoryDto): Promise<Inventory | null>;
    remove(id: number): Promise<Inventory>;
    getUniqueLocations(): Promise<string[]>;
    getUniqueStatuses(): Promise<string[]>;
    findByAttribute(key: string, value: string): Promise<Inventory[]>;
    getUniqueAttributeValues(key: string): Promise<string[]>;
    getUniqueAttributeKeys(): Promise<string[]>;
    getTotalItems(): Promise<number>;
}
