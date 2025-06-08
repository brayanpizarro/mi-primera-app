// src/inventory/dto/update-inventory.dto.ts
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateInventoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)      
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Number)      
  @IsNumber()
  @Min(0)
  quantity?: number;
}
