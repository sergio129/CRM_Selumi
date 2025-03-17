import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'tu-secreto-seguro', // En producción, usar variables de entorno
    });
  }

  async validate(payload: any) {
    // Usar findByEmail en lugar de findById
    const user = await this.usersService.findByEmail(payload.email);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    
    return { 
      id: user.id, 
      email: user.email,
      role: user.role 
    };
  }
}
