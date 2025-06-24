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

      // Actualizar solo los campos proporcionados
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

  async remove(id: number) {
    return await this.userRepository.softDelete(id);
  }
}