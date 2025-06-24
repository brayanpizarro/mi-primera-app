// src/inventory/entities/inventory.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { InventoryAttribute } from './inventory-attribute.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  location: string;

  @Column({ type: 'decimal', nullable: true })
  price: number;

  @Column('int')
  quantity: number;

  @Column({nullable: true})
  status: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @OneToMany(() => InventoryAttribute, attr => attr.inventory)
  attributes: InventoryAttribute[];

  @CreateDateColumn()
  createdAt: Date;
}
