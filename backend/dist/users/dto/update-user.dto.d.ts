import { UserRole } from '../entities/user-role.enum';
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    rut?: string;
    password?: string;
    role: UserRole;
}
