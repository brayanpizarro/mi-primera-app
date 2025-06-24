import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Inventory } from './entities/inventory.entity';
import { InventoryAttribute } from './entities/inventory-attribute.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, InventoryAttribute]),
    UsersModule
  ], 
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
