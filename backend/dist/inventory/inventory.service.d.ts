import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryService {
    private readonly inventoryRepo;
    constructor(inventoryRepo: Repository<Inventory>);
    create(dto: CreateInventoryDto): Promise<Inventory>;
    findAllPaginated(search: string | undefined, page: number, limit: number, location?: string, status?: string, sort?: string, direction?: 'ASC' | 'DESC'): Promise<{
        data: Inventory[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Inventory>;
    update(id: number, dto: UpdateInventoryDto): Promise<Inventory>;
    remove(id: number): Promise<Inventory>;
    getUniqueLocations(): Promise<string[]>;
    getUniqueStatuses(): Promise<string[]>;
}
