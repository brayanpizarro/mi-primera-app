import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsString, Matches, min, MinLength } from "class-validator";
import { UserRole } from "src/users/entities/user-role.enum";

/**
 * DTO para el registro de usuarios
 * @description Define la estructura y validación de los datos de registro:
 * - Nombre: Validación de longitud y limpieza de espacios
 * - Email: Validación de formato de correo electrónico
 * - Contraseña: Longitud mínima y limpieza de espacios
 * - Rol: Validación mediante enum de roles
 * - RUT: Validación de formato chileno
 */
export class RegisterDto {
    /**
     * Nombre completo del usuario
     * @description Se eliminan espacios al inicio y final
     */
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    name: string;

    /**
     * Correo electrónico institucional
     * @description Debe ser un email válido
     */
    @IsEmail()
    email: string;

    /**
     * Contraseña del usuario
     * @description Mínimo 6 caracteres, se eliminan espacios
     */
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(6)
    password: string;

    /**
     * Rol del usuario
     * @description Define los permisos del usuario en el sistema
     */
    @IsEnum(UserRole)
    role: UserRole;

    /**
     * RUT del usuario
     * @description Se transforma a mayúsculas y valida formato chileno
     */
    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()
    @Matches(/^(\d{1,2}\.?\d{3}\.?\d{3}-[\dkK])$/, {
        message: 'El RUT debe tener un formato válido (Ej: 12.345.678-9)',
    })
    rut: string;
}