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

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  /** URL segura devuelta por Cloudinary */
  @Column({ nullable: true })
  imageUrl?: string;

  @Column('json', { nullable: true })
  customAttributes?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
