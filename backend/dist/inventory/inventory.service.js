"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_entity_1 = require("./entities/inventory.entity");
let InventoryService = class InventoryService {
    inventoryRepo;
    constructor(inventoryRepo) {
        this.inventoryRepo = inventoryRepo;
    }
    create(dto) {
        const newItem = this.inventoryRepo.create(dto);
        return this.inventoryRepo.save(newItem);
    }
    async findAllPaginated(search, page, limit, location, status, sort = 'createdAt', direction = 'DESC') {
        const where = {};
        if (search) {
            where.name = (0, typeorm_2.ILike)(`%${search}%`);
        }
        if (location) {
            where.location = location;
        }
        if (status) {
            where.status = status;
        }
        const [data, total] = await this.inventoryRepo.findAndCount({
            where,
            order: { [sort]: direction },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    findOne(id) {
        return this.inventoryRepo.findOneByOrFail({ id });
    }
    async update(id, dto) {
        const item = await this.inventoryRepo.preload({ id, ...dto });
        if (!item)
            throw new common_1.NotFoundException(`Item #${id} not found`);
        return this.inventoryRepo.save(item);
    }
    async remove(id) {
        const item = await this.inventoryRepo.findOneBy({ id });
        if (!item)
            throw new common_1.NotFoundException(`Item #${id} not found`);
        return this.inventoryRepo.remove(item);
    }
    async getUniqueLocations() {
        const result = await this.inventoryRepo
            .createQueryBuilder('inventory')
            .select('DISTINCT inventory.location', 'location')
            .where('inventory.location IS NOT NULL')
            .getRawMany();
        return result.map(row => row.location);
    }
    async getUniqueStatuses() {
        const result = await this.inventoryRepo
            .createQueryBuilder('inventory')
            .select('DISTINCT inventory.status', 'status')
            .where('inventory.status IS NOT NULL')
            .getRawMany();
        return result.map(row => row.status);
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map