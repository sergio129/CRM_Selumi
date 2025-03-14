import { UsersService } from './users.service';
import { User } from './user.entity';
import { Response } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        success: boolean;
        data: User[];
        message: string;
    }>;
    exportToExcel(res: Response): Promise<void>;
    search(term: string): Promise<User[]>;
    findOne(id: string): Promise<{
        success: boolean;
        data: User;
        message: string;
    }>;
    remove(id: string): Promise<void>;
    enableMfa(body: {
        userId: number;
    }): Promise<User>;
    verifyMfa(body: {
        userId: number;
        token: string;
    }): Promise<void>;
    enableBiometric(body: {
        userId: number;
    }): Promise<User>;
    updateProfile(body: any): Promise<import("typeorm").UpdateResult>;
    updateStatus(id: string, isActive: boolean): Promise<User>;
    resetPassword(id: string): Promise<void>;
    create(user: User): Promise<{
        success: boolean;
        message: string;
        data: User;
    }>;
    update(id: string, userData: any): Promise<{
        success: boolean;
        data: User;
        message: string;
    }>;
}
