import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MfaService } from './mfa.service';
import { User } from '../users/user.entity';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly mfaService;
    constructor(usersService: UsersService, jwtService: JwtService, mfaService: MfaService);
    validateUser(documentNumber: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    register(user: User): Promise<User>;
    validateLogin(documentNumber: string, password: string): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            documentNumber: string;
            role: string;
        };
    }>;
    validateMfaToken(userId: number, token: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    private generateTokens;
}
