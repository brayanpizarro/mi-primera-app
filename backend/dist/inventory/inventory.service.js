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
const inventory_attribute_entity_1 = require("./entities/inventory-attribute.entity");
let InventoryService = class InventoryService {
    inventoryRepo;
    attributeRepo;
    constructor(inventoryRepo, attributeRepo) {
        this.inventoryRepo = inventoryRepo;
        this.attributeRepo = attributeRepo;
    }
    async create(dto) {
        const { attributes, ...inventoryData } = dto;
        const newItem = this.inventoryRepo.create(inventoryData);
        const savedItem = await this.inventoryRepo.save(newItem);
        if (attributes && attributes.length > 0) {
            const attributeEntities = attributes.map(attr => this.attributeRepo.create({
                ...attr,
                inventory: savedItem
            }));
            await this.attributeRepo.save(attributeEntities);
        }
        return this.findOne(savedItem.id);
    }
    async findAllPaginated(search, page, limit, location, status, sort = 'createdAt', direction = 'DESC') {
        const queryBuilder = this.inventoryRepo
            .createQueryBuilder('inventory')
            .leftJoinAndSelect('inventory.attributes', 'attributes');
        if (search) {
            const words = search.split(/\s+/).filter(Boolean);
            queryBuilder.groupBy('inventory.id');
            words.forEach((word, idx) => {
                const param = `searchWord${idx}`;
                queryBuilder.having(`SUM(CASE WHEN inventory.name ILIKE :${param} OR attributes.value ILIKE :${param} THEN 1 ELSE 0 END) > 0`);
                queryBuilder.setParameter(param, `%${word}%`);
            });
        }
        if (location) {
            queryBuilder.andWhere('inventory.location = :location', { location });
        }
        if (status) {
            queryBuilder.andWhere('inventory.status = :status', { status });
        }
        queryBuilder.orderBy(`inventory.${sort}`, direction);
        queryBuilder.skip((page - 1) * limit).take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        return this.inventoryRepo.findOne({
            where: { id },
            relations: ['attributes']
        });
    }
    async update(id, dto) {
        const { attributes, ...inventoryData } = dto;
        const item = await this.inventoryRepo.preload({ id, ...inventoryData });
        if (!item)
            throw new common_1.NotFoundException(`Item #${id} not found`);
        const savedItem = await this.inventoryRepo.save(item);
        if (attributes) {
            await this.attributeRepo.delete({ inventory: { id } });
            if (attributes.length > 0) {
                const attributeEntities = attributes.map(attr => this.attributeRepo.create({
                    ...attr,
                    inventory: savedItem
                }));
                await this.attributeRepo.save(attributeEntities);
            }
        }
        return this.findOne(savedItem.id);
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
    async findByAttribute(key, value) {
        return this.inventoryRepo
            .createQueryBuilder('inventory')
            .leftJoinAndSelect('inventory.attributes', 'attributes')
            .where('attributes.key = :key', { key })
            .andWhere('attributes.value = :value', { value })
            .getMany();
    }
    async getUniqueAttributeValues(key) {
        const result = await this.attributeRepo
            .createQueryBuilder('attribute')
            .select('DISTINCT attribute.value', 'value')
            .where('attribute.key = :key', { key })
            .getRawMany();
        return result.map(row => row.value);
    }
    async getUniqueAttributeKeys() {
        const result = await this.attributeRepo
            .createQueryBuilder('attribute')
            .select('DISTINCT attribute.key', 'key')
            .getRawMany();
        return result.map(row => row.key);
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __param(1, (0, typeorm_1.InjectRepository)(inventory_attribute_entity_1.InventoryAttribute)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map