
import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';


@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto);
  }

  @Get()
  findAll(@Query('filter') filter?: string) {  //EJEMPLO DE BUSQUEDA POR FILTRO: http://localhost:3000/inventory?filter=Epson
    console.log('Objetos de inventario:');
    return this.inventoryService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }
}
