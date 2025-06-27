import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<CreateUserDto & import("./entities/user.entity").User>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: number): string;
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
    remove(id: number): Promise<import("typeorm").UpdateResult>;
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
    removeByRut(rut: string): Promise<import("typeorm").UpdateResult>;
}
