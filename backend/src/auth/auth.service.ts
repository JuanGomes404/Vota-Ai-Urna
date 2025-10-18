import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminRepository } from '../repositories/admin.repository';
import { MesarioRepository } from '../repositories/mesario.repository';

export interface UserPayload {
  id: string;
  email?: string;
  usuario?: string;
  role: 'admin' | 'mesario';
  nome: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminRepository: AdminRepository,
    private readonly mesarioRepository: MesarioRepository,
  ) {}

  // Autenticação do Administrador
  async validateAdmin(email: string, senha: string): Promise<UserPayload | null> {
    const admin = await this.adminRepository.findByEmail(email);
    if (admin && admin.senha === senha) {
      return {
        id: admin.id,
        email: admin.email,
        role: 'admin',
        nome: admin.nome,
      };
    }
    return null;
  }

  // Autenticação do Mesário
  async validateMesario(usuario: string, senha: string): Promise<UserPayload | null> {
    const mesario = await this.mesarioRepository.findByUsuario(usuario);
    if (mesario && mesario.senha === senha) {
      return {
        id: mesario.id,
        usuario: mesario.usuario,
        role: 'mesario',
        nome: mesario.nome,
      };
    }
    return null;
  }

  // Gerar token JWT
  async generateToken(user: UserPayload): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      usuario: user.usuario,
      role: user.role,
      nome: user.nome,
    };
    return this.jwtService.sign(payload);
  }

  // Validar token JWT
  async validateToken(token: string): Promise<UserPayload | null> {
    try {
      const payload = this.jwtService.verify(token);
      return {
        id: payload.sub,
        email: payload.email,
        usuario: payload.usuario,
        role: payload.role,
        nome: payload.nome,
      };
    } catch {
      return null;
    }
  }
}
