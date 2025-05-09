import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(dto: CreateInventoryDto): Promise<import("./entities/inventory.entity").Inventory>;
    findAll(filter?: string): Promise<import("./entities/inventory.entity").Inventory[]>;
    findOne(id: string): Promise<import("./entities/inventory.entity").Inventory>;
    update(id: string, dto: UpdateInventoryDto): Promise<import("./entities/inventory.entity").Inventory>;
    remove(id: string): Promise<import("./entities/inventory.entity").Inventory>;
}
