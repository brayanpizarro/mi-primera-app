import { UserRole } from '../entities/user-role.enum';
export declare class UpdateUserDto {
    name?: string;
    currentPassword?: string;
    newPassword?: string;
    role?: UserRole;
}
