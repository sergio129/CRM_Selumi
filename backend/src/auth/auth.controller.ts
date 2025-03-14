import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

  @Post('login')
  async login(@Body() body: { documentNumber: string; password: string }) {
    try {
      console.log('Login attempt:', body.documentNumber); // Debug log
      const result = await this.authService.validateLogin(body.documentNumber, body.password);
      console.log('Login result:', result); // Debug log
      return result;
    } catch (error) {
      console.error('Login error:', error); // Debug log
      throw new HttpException(
        error.message || 'Error en la autenticación',
        error.status || HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Post('register')
  async register(@Body() user: User) {
    try {
      return await this.authService.register(user);
    } catch (error) {
      console.error('Error al registrar:', error.message);
      throw new HttpException(`Error al registrar: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Request() req) {
    try {
      const user = req.user;
      const access_token = this.jwtService.sign({
        sub: user.id,
        documentNumber: user.documentNumber,
        role: user.role
      });

      return {
        success: true,
        access_token,
        message: 'Token renovado exitosamente'
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: 'Error al renovar token',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
