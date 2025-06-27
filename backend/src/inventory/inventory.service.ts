import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryAttribute } from './entities/inventory-attribute.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(InventoryAttribute)
    private readonly attributeRepo: Repository<InventoryAttribute>,
  ) {}

  async create(dto: CreateInventoryDto) {
    const { attributes, ...inventoryData } = dto;
    const newItem = this.inventoryRepo.create(inventoryData);
    const savedItem = await this.inventoryRepo.save(newItem);

    if (attributes && attributes.length > 0) {
      const attributeEntities = attributes.map(({ key, value }) =>
        this.attributeRepo.create({
          key,
          value,
          inventory: savedItem,
        }),
      );
      await this.attributeRepo.save(attributeEntities);
    }

    return this.findOne(savedItem.id);
  }

  async findAllPaginated(
    search: string | undefined,
    page: number,
    limit: number,
    location?: string,
    status?: string,
    sort: string = 'createdAt',
    direction: 'ASC' | 'DESC' = 'DESC',
  ) {
    const queryBuilder = this.inventoryRepo
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.attributes', 'attributes');

    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`;
      queryBuilder.where(
        '(inventory.name ILIKE :search OR inventory.description ILIKE :search OR attributes.value ILIKE :search OR attributes.key ILIKE :search)',
        { search: searchTerm },
      );
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

    const itemsWithAttributes = await Promise.all(
      data.map(async (item) => {
        if (!item.attributes) {
          item.attributes = [];
        }
        return item;
      }),
    );

    return {
      data: itemsWithAttributes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new Error(`El ID proporcionado no es un número válido: ${id}`);
    }

    return this.inventoryRepo.findOne({
      where: { id },
      relations: ['attributes'],
    });
  }

  async update(id: number, dto: UpdateInventoryDto) {
    const { attributes, ...inventoryData } = dto;
    const item = await this.inventoryRepo.preload({ id, ...inventoryData });
    if (!item) throw new NotFoundException(`Item #${id} not found`);

    const savedItem = await this.inventoryRepo.save(item);

    if (attributes) {
      await this.attributeRepo.delete({ inventory: { id } });

      if (attributes.length > 0) {
        const attributeEntities = attributes.map(({ key, value }) =>
          this.attributeRepo.create({
            key,
            value,
            inventory: savedItem,
          }),
        );
        await this.attributeRepo.save(attributeEntities);
      }
    }

    return this.findOne(savedItem.id);
  }

  async remove(id: number) {
    const item = await this.inventoryRepo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Item #${id} not found`);
    return this.inventoryRepo.remove(item);
  }

  async getUniqueLocations(): Promise<string[]> {
    const result = await this.inventoryRepo
      .createQueryBuilder('inventory')
      .select('DISTINCT inventory.location', 'location')
      .where('inventory.location IS NOT NULL')
      .getRawMany();

    return result.map((row) => row.location);
  }

  async getUniqueStatuses(): Promise<string[]> {
    const result = await this.inventoryRepo
      .createQueryBuilder('inventory')
      .select('DISTINCT inventory.status', 'status')
      .where('inventory.status IS NOT NULL')
      .getRawMany();

    return result.map((row) => row.status);
  }

  async findByAttribute(key: string, value: string) {
    return this.inventoryRepo
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.attributes', 'attributes')
      .where('attributes.key = :key', { key })
      .andWhere('attributes.value = :value', { value })
      .getMany();
  }

  async getUniqueAttributeValues(key: string): Promise<string[]> {
    const result = await this.attributeRepo
      .createQueryBuilder('attribute')
      .select('DISTINCT attribute.value', 'value')
      .where('attribute.key = :key', { key })
      .getRawMany();

    return result.map((row) => row.value);
  }

  async getUniqueAttributeKeys(): Promise<string[]> {
    const result = await this.attributeRepo
      .createQueryBuilder('attribute')
      .select('DISTINCT attribute.key', 'key')
      .getRawMany();

    return result.map((row) => row.key);
  }

  async getTotalItems(): Promise<number> {
    return this.inventoryRepo.count();
  }
}
