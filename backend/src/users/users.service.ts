import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) //inyectar el repositorio de usuario
    //el repositorio es una clase que se encarga de interactuar con la base de datos
    private readonly userRepository: Repository<User>, 
  ) {}

  async create(createUserDto: CreateUserDto) { //crear un nuevo usuario
    //el createUserDto es un objeto que contiene los datos del usuario a crear
    return await this.userRepository.save(createUserDto); //guardar el usuario en la base de datos
  }

  async findAll() {//buscar todos los usuarios
    //el find() devuelve todos los usuarios de la base de datos
    return await this.userRepository.find();
  }

  findOne(id: number) {//buscar un usuario por id
    //el id es unico por lo que no se puede repetir
    return `This action returns a #${id} user`;
  }
  
  findOneByRut(rut: string) { //buscar un usuario por rut
    return this.userRepository.findOneBy({rut}); //buscar el usuario por rut en la base de datos
  }

  findOneByEmail(email: string) { //buscar un usuario por email
    //el email es unico por lo que no se puede repetir
    return  this.userRepository.findOneBy({email}); //buscar el usuario por email en la base de datos
  }    async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Si se proporciona una contraseña actual y nueva, validar y actualizar
    if (updateUserDto.currentPassword && updateUserDto.newPassword) {
      const isPasswordValid = await bcrypt.compare(updateUserDto.currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Contraseña actual incorrecta');
      }
      const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, 10);
      user.password = hashedPassword;
    }

    // Actualizar otros campos si se proporcionan
    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }

    return await this.userRepository.save(user);
  }

  async remove(id: number) {//eliminar un usuario por id
    //el id es unico por lo que no se puede repetir
    return await this.userRepository.softDelete(id); //eliminar el usuario de la base de datos (se le pasa el id)
    //return await this.useraRepository.softRemove(id); //eliminar el usuario de la base de datos (se le pasa ña instancia del usuario)
  }
}