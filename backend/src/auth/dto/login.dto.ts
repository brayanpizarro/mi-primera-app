import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class LoginDto {

    @Transform(({ value }) => value.trim().toUpperCase()) // Limpia espacios y pone en mayúscula
    @IsString()
    @Matches(/^(\d{1,2}\.?\d{3}\.?\d{3}-[\dkK])$/, {
    message: 'El RUT debe tener un formato válido (Ej: 12.345.678-9)',
    })
    rut: string; // RUT del usuario

    @Transform(({ value }) => value.trim()) // Eliminar espacios en blanco al inicio y al final
    @IsString()
    @MinLength(6)
    password: string; // Contraseña del usuario
}