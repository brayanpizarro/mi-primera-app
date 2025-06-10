import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UserSeeder {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    seed(): Promise<void>;
}
