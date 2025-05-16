import { UserRole } from './user-role.enum';
export declare class User {
    id: number;
    name: string;
    rut: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
