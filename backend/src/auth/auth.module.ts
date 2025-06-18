import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstanst } from './constants/jwt.constants'; // Importar constantes de JWT
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { ConfigModule } from '@nestjs/config';

/**
 * Módulo de autenticación
 * @description Configura y proporciona todas las funcionalidades de autenticación:
 * - Integración con JWT para tokens de autenticación
 * - Configuración global del módulo JWT
 * - Importación del módulo de usuarios
 * - Tiempo de expiración de tokens configurado a 1 día
 * - Controladores y servicios de autenticación
 */
@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true, // Hacer que el módulo JWT esté disponible en toda la aplicación  
      secret: jwtConstanst.secret,// Clave secreta para firmar el token  
      signOptions: { expiresIn: '1d' }, // Opciones de firma del token (tiempo de expiración)
    }),
  ], // Importar el servicio de usuarios
  controllers: [AuthController], // Controlador de autenticación
  providers: [AuthService, GoogleStrategy] // Servicio de autenticación
})
export class AuthModule {}