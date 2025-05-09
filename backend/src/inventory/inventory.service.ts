// src/inventory/inventory.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
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

  findAll(filter?: string) {
    if (filter) {
      return this.inventoryRepo.find({
        where: { name: Like(`%${filter}%`) },
        order: { createdAt: 'DESC' },
      });
    }
    return this.inventoryRepo.find({ order: { createdAt: 'DESC' } });
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
}
