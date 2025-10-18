import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService, UserPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'vota-ai-secret-key-tcc',
    });
  }

  async validate(payload: any): Promise<UserPayload> {
    return {
      id: payload.sub,
      email: payload.email,
      usuario: payload.usuario,
      role: payload.role,
      nome: payload.nome,
    };
  }
}
