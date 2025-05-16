import { UserRole } from "src/users/entities/user-role.enum";
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    rut: string;
}
