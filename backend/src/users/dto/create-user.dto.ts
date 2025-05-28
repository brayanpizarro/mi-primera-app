import { IsString, MinLength, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../schema/user-role.enum';

export class CreateUserDto {
    @IsString()
    @MinLength(1)
    name: string; // Nombre del usuario

    @IsString()
    rut: string; // Rut del usuario único

    @IsEmail()
    email: string; // Correo electrónico del usuario

    @IsString()
    @MinLength(6)
    password: string; // Contraseña del usuario

    @IsEnum(UserRole)
    role: UserRole;
}


