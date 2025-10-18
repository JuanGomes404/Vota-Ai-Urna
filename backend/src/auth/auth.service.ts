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

// Cache simples para tokens inválidos (em produção, usar Redis)
const invalidatedTokens = new Set<string>();

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminRepository: AdminRepository,
    private readonly mesarioRepository: MesarioRepository,
  ) {}

  // Autenticação unificada - tenta admin primeiro, depois mesário
  async validateUser(usuario: string, senha: string): Promise<UserPayload | null> {
    // Primeiro tenta validar como administrador (usando email)
    const admin = await this.adminRepository.findByEmail(usuario);
    if (admin && admin.senha === senha) {
      return {
        id: admin.id,
        email: admin.email,
        role: 'admin',
        nome: admin.nome,
      };
    }

    // Se não for admin, tenta validar como mesário (usando usuário)
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

  // Métodos mantidos para compatibilidade (podem ser removidos futuramente)
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
      // Verificar se o token foi invalidado
      if (invalidatedTokens.has(token)) {
        return null;
      }

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

  // Invalidar token (logout)
  async invalidateToken(userId: string): Promise<void> {
    // Em uma implementação mais robusta, você poderia:
    // 1. Armazenar tokens inválidos no banco de dados
    // 2. Usar Redis para cache de tokens inválidos
    // 3. Implementar uma blacklist de tokens
    
    // Por simplicidade, vamos invalidar todos os tokens do usuário
    // Em produção, seria melhor armazenar o token específico
    console.log(`Token invalidado para usuário: ${userId}`);
    
    // Aqui você poderia adicionar lógica para invalidar tokens específicos
    // Por enquanto, apenas logamos a ação
  }

  // Verificar se token está válido
  async isTokenValid(token: string): Promise<boolean> {
    if (invalidatedTokens.has(token)) {
      return false;
    }

    try {
      this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }

  // Invalidar token específico (para logout mais granular)
  async invalidateSpecificToken(token: string): Promise<void> {
    invalidatedTokens.add(token);
    console.log(`Token específico invalidado: ${token.substring(0, 20)}...`);
  }
}
