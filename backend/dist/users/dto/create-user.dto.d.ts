import { UserRole } from '../schema/user-role.enum';
export declare class CreateUserDto {
    name: string;
    rut: string;
    email: string;
    password: string;
    role: UserRole;
}
