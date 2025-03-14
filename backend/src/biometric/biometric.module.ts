import { Module } from '@nestjs/common';
import { BiometricService } from './biometric.service';
import { BiometricController } from './biometric.controller';
import { AccessControlService } from './access-control.service';
import { AccessControlController } from './access-control.controller';

@Module({
  providers: [BiometricService, AccessControlService],
  controllers: [BiometricController, AccessControlController],
})
export class BiometricModule {}
