import { UserRole } from "src/users/schema/user-role.enum";
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    rut: string;
}
