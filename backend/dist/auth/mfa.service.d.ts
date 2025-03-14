export declare class MfaService {
    generateSecret(email: string): Promise<{
        secret: string;
        qrCode: string;
    }>;
    verifyToken(secret: string, token: string): boolean;
    generateToken(secret: string): string;
}
