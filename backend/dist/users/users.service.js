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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        return await this.userRepository.save(createUserDto);
    }
    async findAll() {
        return await this.userRepository.find();
    }
    findOne(id) {
        return `This action returns a #${id} user`;
    }
    findOneByRut(rut) {
        return this.userRepository.findOneBy({ rut });
    }
    findOneByEmail(email) {
        return this.userRepository.findOneBy({ email });
    }
    async update(id, updateUserDto) {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
            });
            if (!user) {
                throw new common_1.NotFoundException('Usuario no encontrado');
            }
            if (updateUserDto.name) {
                user.name = updateUserDto.name;
            }
            if (updateUserDto.currentPassword && updateUserDto.newPassword) {
                const isPasswordValid = await bcrypt.compare(updateUserDto.currentPassword, user.password);
                if (!isPasswordValid) {
                    throw new common_1.BadRequestException('Contraseña actual incorrecta');
                }
                user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
            }
            const updatedUser = await this.userRepository.save(user);
            const { password, ...result } = updatedUser;
            return result;
        }
        catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }
    async updateByRut(rut, updateUserDto) {
        const user = await this.userRepository.findOne({
            where: { rut },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con RUT ${rut} no encontrado`);
        }
        if (updateUserDto.name) {
            user.name = updateUserDto.name;
        }
        if (updateUserDto.currentPassword && updateUserDto.newPassword) {
            const isPasswordValid = await bcrypt.compare(updateUserDto.currentPassword, user.password);
            if (!isPasswordValid) {
                throw new common_1.NotFoundException('Contraseña actual incorrecta');
            }
            user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
        }
        const updatedUser = await this.userRepository.save(user);
        const { password, ...result } = updatedUser;
        return result;
    }
    async updateByEmail(email, updateUserDto) {
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con email ${email} no encontrado`);
        }
        if (updateUserDto.name) {
            user.name = updateUserDto.name;
        }
        if (updateUserDto.rut && updateUserDto.rut !== '0-0') {
            const existingUser = await this.userRepository.findOne({
                where: { rut: updateUserDto.rut },
            });
            if (existingUser && existingUser.email !== email) {
                throw new common_1.BadRequestException('El RUT ya está registrado por otro usuario');
            }
            user.rut = updateUserDto.rut;
        }
        if (updateUserDto.newPassword) {
            if (user.rut === '0-0' || user.email.endsWith('@gmail.com')) {
                user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
            }
            else {
                if (!updateUserDto.currentPassword) {
                    throw new common_1.BadRequestException('Se requiere la contraseña actual para cambiarla');
                }
                const isPasswordValid = await bcrypt.compare(updateUserDto.currentPassword, user.password);
                if (!isPasswordValid) {
                    throw new common_1.BadRequestException('Contraseña actual incorrecta');
                }
                user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
            }
        }
        const updatedUser = await this.userRepository.save(user);
        const { password, ...result } = updatedUser;
        return result;
    }
    async remove(id) {
        return await this.userRepository.softDelete(id);
    }
    async removeByRut(rut) {
        return await this.userRepository.softDelete({ rut });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map