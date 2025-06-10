import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MinLength } from "class-validator";

/**
 * DTO para el inicio de sesión
 * @description Define la estructura y validación de los datos de inicio de sesión:
 * - RUT: Validación de formato chileno, transformación a mayúsculas
 * - Contraseña: Longitud mínima y limpieza de espacios
 */
export class LoginDto {
    /**
     * RUT del usuario
     * @description Se transforma automáticamente a mayúsculas y se valida el formato chileno
     */
    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()
    @Matches(/^(\d{1,2}\.?\d{3}\.?\d{3}-[\dkK])$/, {
        message: 'El RUT debe tener un formato válido (Ej: 12.345.678-9)',
    })
    rut: string;

    /**
     * Contraseña del usuario
     * @description Se requiere una longitud mínima de 6 caracteres
     */
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(6)
    password: string;
}