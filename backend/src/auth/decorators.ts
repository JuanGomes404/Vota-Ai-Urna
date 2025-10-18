import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard, Roles } from './roles.guard';

// Decorator simplificado para Admin
export function AdminOnly() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('admin')
  );
}

// Decorator simplificado para Mesário
export function MesarioOnly() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('mesario')
  );
}

// Decorator para ambos Admin e Mesário
export function AdminOrMesario() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('admin', 'mesario')
  );
}

// Decorator apenas para autenticação (sem verificação de role)
export function AuthRequired() {
  return applyDecorators(
    UseGuards(JwtAuthGuard)
  );
}
