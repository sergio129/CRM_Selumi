import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
        };
        message?: undefined;
    } | {
        success: boolean;
        message: any;
    }>;
}
