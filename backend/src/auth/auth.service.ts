import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs'; // Importar bcrypt para encriptar contraseñas
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/users/entities/user-role.enum';

/**
 * Servicio de autenticación
 * @description Maneja toda la lógica de autenticación del sistema:
 * - Registro de nuevos usuarios
 * - Inicio de sesión
 * - Encriptación de contraseñas
 * - Generación de tokens JWT
 */
@Injectable()
export class AuthService {

    constructor(
        private readonly usersService:UsersService, // Inyectar el servicio de autenticación
        private readonly jwtService:JwtService, // Inyectar el servicio de JWT
    
    ) { } 

    /**
     * Registra un nuevo usuario en el sistema
     * @param registerDto - Datos de registro del usuario
     * @throws BadRequestException - Si el usuario ya existe
     * @returns Usuario creado
     */
    async register(registerDto:RegisterDto) { // Método para registrar un nuevo usuario
        const user= await this.usersService.findOneByRut(registerDto.rut); // Buscar el usuario por email
        if(user) { // Si el usuario ya existe
            throw new BadRequestException('User already exists'); // Lanzar un error
        }
        const passwordHash = await bcryptjs.hash(registerDto.password, 10); // Encriptar la contraseña
        const newUser = {
            ...registerDto,// Desestructurar el objeto registerDto
            password: passwordHash, // reemplazar la contraseña por la encriptada
          };
        return await this.usersService.create(newUser); // Llama al servicio de usuarios para crear un nuevo usuario
    }
    /**
     * Autentica un usuario y genera un token JWT
     * @param loginDto - Credenciales de inicio de sesión
     * @throws UnauthorizedException - Si las credenciales son inválidas
     * @returns Token JWT y datos del usuario
     */
    async login(loginDto:LoginDto){ // Método para iniciar sesión
        const user= await this.usersService.findOneByRut(loginDto.rut);
        if(!user) {
            throw new UnauthorizedException('RUT no encontrado');
        }
        const isPassword = await bcryptjs.compare(loginDto.password, user.password);
        if(!isPassword) {
            throw new UnauthorizedException('Contraseña incorrecta');
        }

        const payload = {
            email: user.email,
            rut: user.rut,
            role: user.role // Asegúrate de que tu entidad User tenga un campo role
        };

        const token = this.jwtService.sign(payload);

        return {
            token,
            user: {
                name: user.name,
                email: user.email,
                rut: user.rut,
                role: user.role
            }
        };
    }

    async googleLogin(req) {
        if (!req.user) {
            throw new UnauthorizedException('No user from google');
        }

        const { email, firstName, lastName, picture } = req.user;
        
        // Check if user exists
        let user = await this.usersService.findOneByEmail(email);
        
        // If user doesn't exist, create a new one
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8); // Generate random password
            const passwordHash = await bcryptjs.hash(randomPassword, 10); // Encriptar la contraseña
            
            const newUser = {
                email,
                name: `${firstName} ${lastName}`,
                password: passwordHash, // Usar la contraseña encriptada
                role: UserRole.USER, // Default role
                rut: '0-0', // Default RUT for Google users
            };
            user = await this.usersService.create(newUser);
        }

        const payload = {
            email: user.email,
            rut: user.rut,
            role: user.role
        };

        const token = this.jwtService.sign(payload);

        return {
            token,
            user: {
                name: user.name,
                email: user.email,
                rut: user.rut,
                role: user.role,
                picture
            }
        };
    }
}