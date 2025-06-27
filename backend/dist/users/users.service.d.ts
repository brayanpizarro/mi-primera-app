import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<CreateUserDto & User>;
    findAll(): Promise<User[]>;
    findOne(id: number): string;
    findOneByRut(rut: string): Promise<User | null>;
    findOneByEmail(email: string): Promise<User | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        name: string;
        rut: string;
        email: string;
        role: import("./entities/user-role.enum").UserRole;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
    }>;
    updateByRut(rut: string, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        name: string;
        rut: string;
        email: string;
        role: import("./entities/user-role.enum").UserRole;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
    }>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
    removeByRut(rut: string): Promise<import("typeorm").UpdateResult>;
}
