import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService, UserPayload } from '../auth/auth.service';

export const ROLES_KEY = 'roles';

// Decorator para definir roles necessárias
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('🛡️ RolesGuard - Roles necessárias:', requiredRoles);

    if (!requiredRoles) {
      console.log('✅ RolesGuard - Nenhuma role necessária, acesso liberado');
      return true; // Se não há roles definidas, permite acesso
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    console.log('🛡️ RolesGuard - Token recebido:', token ? token.substring(0, 20) + '...' : 'Nenhum token');

    if (!token) {
      console.log('❌ RolesGuard - Token não fornecido');
      throw new UnauthorizedException('Token não fornecido');
    }

    const user: UserPayload = await this.authService.validateToken(token);
    console.log('🛡️ RolesGuard - Usuário validado:', user ? `${user.nome} (${user.role})` : 'Token inválido');

    if (!user) {
      console.log('❌ RolesGuard - Token inválido');
      throw new UnauthorizedException('Token inválido');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    console.log('🛡️ RolesGuard - Usuário tem role necessária?', hasRole);

    if (!hasRole) {
      console.log('❌ RolesGuard - Acesso negado, role necessária:', requiredRoles.join(' ou '));
      throw new UnauthorizedException(`Acesso negado. Role necessária: ${requiredRoles.join(' ou ')}`);
    }

    // Adicionar usuário ao request para uso nos controllers
    request.user = user;
    console.log('✅ RolesGuard - Acesso autorizado');
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
