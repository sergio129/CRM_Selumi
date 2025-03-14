import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    login(body: {
        documentNumber: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            documentNumber: string;
            role: string;
        };
    }>;
    register(user: User): Promise<User>;
    refreshToken(req: any): Promise<{
        success: boolean;
        access_token: string;
        message: string;
    }>;
}
