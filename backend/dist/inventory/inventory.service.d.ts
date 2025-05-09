import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryService {
    private readonly inventoryRepo;
    constructor(inventoryRepo: Repository<Inventory>);
    create(dto: CreateInventoryDto): Promise<Inventory>;
    findAll(filter?: string): Promise<Inventory[]>;
    findOne(id: number): Promise<Inventory>;
    update(id: number, dto: UpdateInventoryDto): Promise<Inventory>;
    remove(id: number): Promise<Inventory>;
}
