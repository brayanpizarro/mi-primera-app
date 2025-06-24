import { IsString, IsNotEmpty } from 'class-validator';

export class InventoryAttributeDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
} 