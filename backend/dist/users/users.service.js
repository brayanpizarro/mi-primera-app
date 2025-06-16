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
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
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
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        if (updateUserDto.currentPassword && updateUserDto.newPassword) {
            const isPasswordValid = await bcrypt.compare(updateUserDto.currentPassword, user.password);
            if (!isPasswordValid) {
                throw new Error('Contraseña actual incorrecta');
            }
            const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, 10);
            user.password = hashedPassword;
        }
        if (updateUserDto.name) {
            user.name = updateUserDto.name;
        }
        if (updateUserDto.role) {
            user.role = updateUserDto.role;
        }
        return await this.userRepository.save(user);
    }
    async remove(id) {
        return await this.userRepository.softDelete(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map