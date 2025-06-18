import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/users/entities/user-role.enum';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<import("../users/dto/create-user.dto").CreateUserDto & import("../users/entities/user.entity").User>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            name: string;
            email: string;
            rut: string;
            role: UserRole;
        };
    }>;
    googleLogin(req: any): Promise<{
        token: string;
        user: {
            name: string;
            email: string;
            rut: string;
            role: UserRole;
            picture: any;
        };
    }>;
}
