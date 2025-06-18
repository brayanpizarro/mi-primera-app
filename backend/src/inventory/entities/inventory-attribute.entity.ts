import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity()
export class InventoryAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inventory, inventory => inventory.attributes, {
    onDelete: 'CASCADE'
  })
  inventory: Inventory;

  @Column()
  key: string;

  @Column()
  value: string;
} 