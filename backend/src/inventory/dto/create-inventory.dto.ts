import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  location: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}