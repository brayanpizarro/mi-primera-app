"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcryptjs = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const user_role_enum_1 = require("../users/entities/user-role.enum");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const user = await this.usersService.findOneByRut(registerDto.rut);
        if (user) {
            throw new common_1.BadRequestException('User already exists');
        }
        const passwordHash = await bcryptjs.hash(registerDto.password, 10);
        const newUser = {
            ...registerDto,
            password: passwordHash,
        };
        return await this.usersService.create(newUser);
    }
    async login(loginDto) {
        const user = await this.usersService.findOneByRut(loginDto.rut);
        if (!user) {
            throw new common_1.UnauthorizedException('RUT no encontrado');
        }
        const isPassword = await bcryptjs.compare(loginDto.password, user.password);
        if (!isPassword) {
            throw new common_1.UnauthorizedException('Contraseña incorrecta');
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
                role: user.role
            }
        };
    }
    async googleLogin(req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('No user from google');
        }
        const { email, firstName, lastName, picture } = req.user;
        let user = await this.usersService.findOneByEmail(email);
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8);
            const passwordHash = await bcryptjs.hash(randomPassword, 10);
            const newUser = {
                email,
                name: `${firstName} ${lastName}`,
                password: passwordHash,
                role: user_role_enum_1.UserRole.USER,
                rut: '0-0',
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map