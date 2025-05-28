import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./schema/user.schema").User>;
    findAll(): Promise<import("./schema/user.schema").User[]>;
    findOne(id: string): Promise<import("./schema/user.schema").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./schema/user.schema").User>;
    softDelete(id: string): Promise<import("./schema/user.schema").User>;
    restore(id: string): Promise<import("./schema/user.schema").User>;
}
