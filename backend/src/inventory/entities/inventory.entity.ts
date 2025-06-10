// src/inventory/entities/inventory.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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

  @Column('json', { nullable: true })
  customAttributes?: Record<string, any>;

  @Column({ nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;
}
