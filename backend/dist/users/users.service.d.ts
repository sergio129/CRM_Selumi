import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findByDocumentNumber(documentNumber: string): Promise<User>;
    remove(id: number): Promise<void>;
    create(user: User): Promise<User>;
    assignRole(documentNumber: string, role: string): Promise<void>;
    incrementLoginAttempts(userId: number): Promise<void>;
    resetLoginAttempts(userId: number): Promise<void>;
    enableMfa(userId: number): Promise<User>;
    verifyMfa(userId: number, token: string): Promise<void>;
    enableBiometric(userId: number): Promise<User>;
    updateProfile(userId: number, data: any): Promise<import("typeorm").UpdateResult>;
    updateStatus(id: number, isActive: boolean): Promise<User>;
    search(term: string): Promise<User[]>;
    resetPassword(id: number): Promise<void>;
    exportToExcel(): Promise<Buffer>;
    update(id: number, userData: Partial<User>): Promise<User>;
    updateLastLogin(userId: number): Promise<void>;
}
