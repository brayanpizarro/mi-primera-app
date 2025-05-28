import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly usersService: UsersService, // Inyectar el servicio de usuarios
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.findOneByRut(registerDto.rut); // Buscar el usuario por RUT

    if (user) {
        throw new BadRequestException('User already exists');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10); // ✅ usa bcrypt.hash

    const newUser = {
        ...registerDto,
        password: passwordHash, // Guarda la contraseña encriptada
    };

    return await this.usersService.create(newUser); // Guarda el nuevo usuario en MongoDB
  }

  async validateUser(rut: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ rut, isActive: true }).exec();
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { password: _, ...result } = user.toObject();
    return result;
  }

  async login(user: any) {
    const payload = { username: user.rut, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
