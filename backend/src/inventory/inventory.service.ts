import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, ILike } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  create(dto: CreateInventoryDto) {
    const newItem = this.inventoryRepo.create(dto);
    return this.inventoryRepo.save(newItem);
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
  const where: FindOptionsWhere<Inventory> = {};

  if (search) {
    where.name = ILike(`%${search}%`);
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


  findOne(id: number) {
    return this.inventoryRepo.findOneByOrFail({ id });
  }

  async update(id: number, dto: UpdateInventoryDto) {
    const item = await this.inventoryRepo.preload({ id, ...dto });
    if (!item) throw new NotFoundException(`Item #${id} not found`);
    return this.inventoryRepo.save(item);
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

    return result.map(row => row.location);
  }
  async getUniqueStatuses(): Promise<string[]> {
      const result = await this.inventoryRepo
        .createQueryBuilder('inventory')
        .select('DISTINCT inventory.status', 'status')
        .where('inventory.status IS NOT NULL')
        .getRawMany();

      return result.map(row => row.status);
  }
}
