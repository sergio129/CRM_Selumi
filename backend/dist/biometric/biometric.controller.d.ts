import { BiometricService } from './biometric.service';
export declare class BiometricController {
    private readonly biometricService;
    constructor(biometricService: BiometricService);
    capture(data: any): void;
    verify(data: any): void;
    integrate(data: any): void;
}
