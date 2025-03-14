import { Controller, Post, Body } from '@nestjs/common';
import { BiometricService } from './biometric.service';

@Controller('biometric')
export class BiometricController {
  constructor(private readonly biometricService: BiometricService) {}

  @Post('capture')
  capture(@Body() data: any) {
    // Implementar lógica para capturar datos biométricos
  }

  @Post('verify')
  verify(@Body() data: any) {
    // Implementar lógica para verificar datos biométricos
  }

  @Post('integrate')
  integrate(@Body() data: any) {
    const { deviceId, biometricData } = data;
    return this.biometricService.integrateWithAccessControl(deviceId, biometricData);
  }
}
