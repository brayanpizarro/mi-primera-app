import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private userModel;
    private readonly usersService;
    private jwtService;
    constructor(userModel: Model<UserDocument>, usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<User>;
    validateUser(rut: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
