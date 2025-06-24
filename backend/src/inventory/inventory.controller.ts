import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../users/entities/user-role.enum';

/**
 * Controlador de inventario
 * @description Maneja todas las operaciones CRUD del inventario:
 * - Creación de items (solo admin)
 * - Lectura de items (admin y usuarios)
 * - Actualización de items (solo admin)
 * - Eliminación de items (solo admin)
 * - Búsqueda por filtros
 */
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /**
   * Endpoint público para verificar la conexión a la base de datos
   */
  @Get('health')
  async healthCheck() {
    try {
      const total = await this.inventoryService.getTotalItems();
      return { 
        status: 'OK', 
        message: 'Conexión a la base de datos exitosa',
        totalItems: total 
      };
    } catch (error) {
      return { 
        status: 'ERROR', 
        message: 'Error de conexión a la base de datos',
        error: error.message 
      };
    }
  }

  /**
   * Crea un nuevo item en el inventario
   * @param dto - Datos del nuevo item
   * @returns Item creado
   * @roles ADMIN
   */
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto);
  }

  /**
   * Obtiene todos los items del inventario
   * @param filter - Filtro opcional para búsqueda por nombre
   * @returns Lista de items que coinciden con el filtro
   * @roles ADMIN, USER
   */
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll(
    @Query('filter') filter?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('location') location?: string,
    @Query('status') status?: string,
    @Query('sort') sort = 'createdAt',
    @Query('direction') direction: 'ASC' | 'DESC' = 'DESC',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.inventoryService.findAllPaginated(
      filter, 
      pageNum, 
      limitNum, 
      location, 
      status, 
      sort, 
      direction
    );
  }

  /**
   * Obtiene un item específico por ID
   * @param id - ID del item a buscar
   * @returns Item encontrado
   * @roles ADMIN, USER
   */
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id);
  }

  /**
   * Actualiza un item existente
   * @param id - ID del item a actualizar
   * @param dto - Datos actualizados del item
   * @returns Item actualizado
   * @roles ADMIN
   */
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(+id, dto);
  }

  /**
   * Elimina un item del inventario
   * @param id - ID del item a eliminar
   * @returns void
   * @roles ADMIN
   */
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }

  @Get('count')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getCount() {
    const total = await this.inventoryService.getTotalItems();
    return { total };
  }

  @Get('locations')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getLocations() {
    return this.inventoryService.getUniqueLocations();
  }
  
  @Get('statuses')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getStatuses() {
    return this.inventoryService.getUniqueStatuses();
  }

  @Get('attributes')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getAttributeKeys() {
    return this.inventoryService.getUniqueAttributeKeys();
  }

  @Get('attributes/:key')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async findByAttribute(
    @Param('key') key: string,
    @Query('value') value: string,
  ) {
    if (value) {
      return this.inventoryService.findByAttribute(key, value);
    }
    return this.inventoryService.getUniqueAttributeValues(key);
  }
}
