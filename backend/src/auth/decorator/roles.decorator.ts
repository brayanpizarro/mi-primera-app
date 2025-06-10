import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user-role.enum';

export const ROLES_KEY = 'roles';
/**
 * Decorador personalizado para especificar los roles de usuario requeridos para los controladores o manejadores de rutas.
 *
 * @param roles - Parámetro rest de valores `UserRole` que indica qué roles tienen acceso permitido.
 * @returns Una función decoradora que establece la metadata de roles requeridos usando `ROLES_KEY`.
 *
 * @ejemplo
 * ```typescript
 * @Roles(UserRole.Admin, UserRole.User)
 * @Get()
 * findAll() { ... }
 * ```
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
