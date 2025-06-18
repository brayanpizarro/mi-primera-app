/**
 * Controlador que maneja todas las rutas relacionadas con la autenticación
 * Incluye endpoints para registro, inicio de sesión y perfil de usuario
 */
import { Body, Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { Request, Response } from 'express';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    /**
     * Endpoint para registrar un nuevo usuario en el sistema
     * @param registerDto - Datos del usuario a registrar
     * @returns Usuario registrado
     */
    @Post('register')
    register(
        @Body() // Decorador para obtener el cuerpo de la solicitud
        registerDto:RegisterDto,
    ){
        return this.authService.register(registerDto); // Llama al servicio de autenticación para registrar un nuevo usuario


    }

    /**
     * Endpoint para iniciar sesión
     * @param loginDto - Credenciales de inicio de sesión (RUT y contraseña)
     * @returns Token JWT y datos del usuario
     */
    @Post('login')
    login(
        @Body()
        loginDto: LoginDto,
    ) {
        return this.authService.login(loginDto);
    }

    /**
     * Endpoint protegido que devuelve el perfil del usuario actual
     * @param req - Objeto Request de Express que contiene los datos del usuario
     * @returns Datos del perfil del usuario
     */
    @Get('profile')
    @UseGuards(AuthGuard)
    profile(@Req() req: Request) {
        return (req as any).user;
    }

    @Get('google')
    @UseGuards(PassportAuthGuard('google'))
    async googleAuth() {
        // This endpoint initiates the Google OAuth flow
    }

    @Get('google/callback')
    @UseGuards(PassportAuthGuard('google'))
    async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
        const result = await this.authService.googleLogin(req);
        // Redirect to frontend with token and user info in the URL
        return res.redirect(
            `http://localhost:5173/login?token=${result.token}` +
            `&name=${encodeURIComponent(result.user.name)}` +
            `&email=${encodeURIComponent(result.user.email)}` +
            `&role=${result.user.role}`
        );
    }
}