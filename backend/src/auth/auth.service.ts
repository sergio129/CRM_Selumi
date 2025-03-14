import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MfaService } from './mfa.service';
import { User } from '../users/user.entity'; // Add this import
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mfaService: MfaService,
  ) {}

  async validateUser(documentNumber: string, pass: string): Promise<any> {
    const user = await this.usersService.findByDocumentNumber(documentNumber);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { documentNumber: user.documentNumber, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: User): Promise<User> {
    const existingUser = await this.usersService.findByEmail(user.email);
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    user.password = await bcrypt.hash(user.password, 10);
    const newUser = await this.usersService.create(user);
    await this.usersService.assignRole(user.documentNumber, 'user'); // Asignar rol al usuario
    return newUser;
  }

  async validateLogin(documentNumber: string, password: string) {
    try {
      console.log('Validating login for:', documentNumber); // Debug log
      
      const cleanDocumentNumber = documentNumber.replace(/\./g, '');
      const user = await this.usersService.findByDocumentNumber(cleanDocumentNumber);
      
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.UNAUTHORIZED);
      }

      console.log('User found:', { ...user, password: '****' }); // Debug log

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid); // Debug log

      if (!isPasswordValid) {
        await this.usersService.incrementLoginAttempts(user.id);
        throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
      }

      const result = {
        access_token: this.jwtService.sign({
          sub: user.id,
          documentNumber: user.documentNumber,
          role: user.role
        }),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          documentNumber: user.documentNumber,
          role: user.role
        }
      };

      console.log('Login successful, returning:', { ...result, access_token: '****' }); // Debug log
      return result;

    } catch (error) {
      console.error('ValidateLogin error:', error); // Debug log
      throw error;
    }
  }

  async validateMfaToken(userId: number, token: string) {
    const user = await this.usersService.findOne(userId);
    
    if (!user.mfaSecret) {
      throw new HttpException('MFA no configurado', HttpStatus.BAD_REQUEST);
    }

    const isValid = this.mfaService.verifyToken(user.mfaSecret, token);
    
    if (!isValid) {
      throw new HttpException('Código MFA inválido', HttpStatus.UNAUTHORIZED);
    }

    return this.generateTokens(user);
  }

  private generateTokens(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role,
      documentNumber: user.documentNumber
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' })
    };
  }
}
