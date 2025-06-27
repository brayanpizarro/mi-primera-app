import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  findOneByRut(rut: string) {
    return this.userRepository.findOneBy({ rut });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      
      if (updateUserDto.name) {
        user.name = updateUserDto.name;
      }

      if (updateUserDto.currentPassword && updateUserDto.newPassword) {
        const isPasswordValid = await bcrypt.compare(
          updateUserDto.currentPassword,
          user.password,
        );

        if (!isPasswordValid) {
          throw new BadRequestException('Contraseña actual incorrecta');
        }

        user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
      }

      const updatedUser = await this.userRepository.save(user);
      const { password, ...result } = updatedUser;
      return result;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  async updateByRut(rut: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { rut },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.currentPassword && updateUserDto.newPassword) {
      const isPasswordValid = await bcrypt.compare(
        updateUserDto.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new NotFoundException('Contraseña actual incorrecta');
      }

      user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
    }

    const updatedUser = await this.userRepository.save(user);
    const { password, ...result } = updatedUser;
    return result;
  }

  async updateByEmail(email: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    // Permitir actualizar RUT para usuarios de Google
    if (updateUserDto.rut && updateUserDto.rut !== '0-0') {
      // Verificar que el RUT no esté en uso por otro usuario
      const existingUser = await this.userRepository.findOne({
        where: { rut: updateUserDto.rut },
      });
      if (existingUser && existingUser.email !== email) {
        throw new BadRequestException('El RUT ya está registrado por otro usuario');
      }
      user.rut = updateUserDto.rut;
    }

    // Permitir a usuarios Google cambiar contraseña sin la actual
    if (updateUserDto.newPassword) {
      // Si el usuario es Google (rut original era '0-0' o email termina en @gmail.com)
      if (user.rut === '0-0' || user.email.endsWith('@gmail.com')) {
        user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
      } else {
        // Usuario normal: requiere contraseña actual
        if (!updateUserDto.currentPassword) {
          throw new BadRequestException('Se requiere la contraseña actual para cambiarla');
        }
        const isPasswordValid = await bcrypt.compare(
          updateUserDto.currentPassword,
          user.password,
        );
        if (!isPasswordValid) {
          throw new BadRequestException('Contraseña actual incorrecta');
        }
        user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
      }
    }

    const updatedUser = await this.userRepository.save(user);
    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: number) {
    return await this.userRepository.softDelete(id);
  }
  async removeByRut(rut: string) {
    return await this.userRepository.softDelete({rut});
  }
}