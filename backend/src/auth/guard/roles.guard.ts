import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user-role.enum';
import { UsersService } from '../../users/users.service';

/**
 * Guard que verifica si el usuario actual tiene uno de los roles requeridos para acceder a una ruta.
 * Utiliza la metadata establecida por el decorador `@Roles()` para determinar los roles necesarios.
 * 
 * @remarks
 * - Obtiene los roles requeridos de la metadata del handler de la ruta.
 * - Extrae el usuario del objeto request y obtiene los detalles del usuario desde la base de datos.
 * - Concede acceso si el rol del usuario coincide con uno de los roles requeridos.
 * 
 * @constructor
 * @param reflector - Utilizado para acceder a la metadata del handler de la ruta.
 * @param usersService - Servicio para obtener detalles del usuario desde la base de datos.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.email) {
      return false;
    }

    const userFromDb = await this.usersService.findOneByEmail(user.email);
    if (!userFromDb) {
      return false;
    }

    return requiredRoles.includes(userFromDb.role);
  }
}
