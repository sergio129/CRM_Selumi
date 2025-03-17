import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { MfaService } from './mfa.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'tu-secreto-seguro', // En producción, usar variables de entorno
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    AuthService, 
    JwtStrategy, 
    MfaService,
    JwtAuthGuard  // Agregar JwtAuthGuard a los providers
  ],
  controllers: [AuthController],
  exports: [AuthService, MfaService, JwtAuthGuard],
})
export class AuthModule {}
