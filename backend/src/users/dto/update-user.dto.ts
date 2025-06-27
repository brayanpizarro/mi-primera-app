import { IsEnum, IsOptional, IsString, MinLength, Matches } from 'class-validator';
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

    @IsString()
    @IsOptional()
    @Matches(/^(\d{1,2}\.?\d{3}\.?\d{3}-[\dkK])$/, {
        message: 'El RUT debe tener un formato válido (Ej: 12.345.678-9)',
    })
    rut?: string; // RUT del usuario (para usuarios de Google)
}
