import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.enum';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    const adminExists = await this.userRepository.findOne({
      where: { role: UserRole.ADMIN }
    });

    if (!adminExists) {
      const adminPassword = await bcryptjs.hash('admin123', 10);
        const admin = this.userRepository.create({
        name: 'Administrador',
        email: 'admin@admin.com',
        password: adminPassword,
        rut: '11.111.111-1',
        role: UserRole.ADMIN,
      });

      await this.userRepository.save(admin);
      console.log('Usuario administrador creado con éxito');
      console.log('Email: admin@admin.com');
      console.log('Contraseña: admin123');
      console.log('RUT: 11.111.111-1');
    }
  }
}
