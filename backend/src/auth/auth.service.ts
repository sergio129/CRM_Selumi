import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(loginDto.email);
      
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Comparar la contraseña usando bcrypt
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      const payload = { 
        email: user.email, 
        sub: user.id,
        role: user.role || 'user'
      };

      return {
        success: true,
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }
}
