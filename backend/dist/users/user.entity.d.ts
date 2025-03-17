export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    documentNumber: string;
    phoneNumber: string;
    role: string;
    profilePicture: string;
    isBiometricEnabled: boolean;
    isMfaEnabled: boolean;
    mfaSecret: string;
    isActive: boolean;
    loginAttempts: number;
    lastLogin: Date;
    blockedUntil: Date;
    createdAt: Date;
    updatedAt: Date;
    emailVerified: boolean;
    verificationToken: string;
    address: string;
    birthDate: Date;
    emergencyContact: string;
    emergencyPhone: string;
    position: string;
    department: string;
}
