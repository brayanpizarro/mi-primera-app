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
exports.UserSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const user_role_enum_1 = require("../entities/user-role.enum");
const bcryptjs = require("bcryptjs");
let UserSeeder = class UserSeeder {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async seed() {
        const adminExists = await this.userRepository.findOne({
            where: { role: user_role_enum_1.UserRole.ADMIN }
        });
        if (!adminExists) {
            const adminPassword = await bcryptjs.hash('admin123', 10);
            const admin = this.userRepository.create({
                name: 'Administrador',
                email: 'admin@ucn.cl',
                password: adminPassword,
                rut: '11.111.111-1',
                role: user_role_enum_1.UserRole.ADMIN,
            });
            await this.userRepository.save(admin);
            console.log('Usuario administrador creado con éxito');
            console.log('Email: admin@ucn.com');
            console.log('Contraseña: admin123');
            console.log('RUT: 11.111.111-1');
        }
    }
};
exports.UserSeeder = UserSeeder;
exports.UserSeeder = UserSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserSeeder);
//# sourceMappingURL=user.seeder.js.map