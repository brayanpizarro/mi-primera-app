import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user-role.enum';

export class UpdateUserDto {
    @IsString()
    @MinLength(1)
    @IsOptional()
    name?: string; // Nombre del usuario
    
    @IsString()
    @MinLength(6)
    @IsOptional()
    currentPassword?: string; // Contraseña actual para validación
    
    @IsString()
    @MinLength(6)
    @IsOptional()
    newPassword?: string; // Nueva contraseña
    
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole; // Rol del usuario
}
