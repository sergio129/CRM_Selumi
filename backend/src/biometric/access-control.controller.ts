import { Controller, Post, Body } from '@nestjs/common';
import { AccessControlService } from './access-control.service';

@Controller('access-control')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Post('grant')
  grantAccess(@Body() data: any) {
    // Implementar lógica para conceder acceso
  }

  @Post('revoke')
  revokeAccess(@Body() data: any) {
    // Implementar lógica para revocar acceso
  }
}
