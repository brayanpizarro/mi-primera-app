import { IsEnum, IsOptional, IsString, MinLength, IsEmail } from 'class-validator';
import { UserRole } from '../schema/user-role.enum';

export class UpdateUserDto {
    @IsString()
    @MinLength(1)
    @IsOptional()
    name?: string; // Nombre del usuario
    
    @IsEmail()
    @IsOptional()
    email?: string; // Correo electrónico del usuario
    
    @IsString()
    @IsOptional()
    rut?: string; // Rut del usuario

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string; // Contraseña del usuario
    
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}
