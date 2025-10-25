import { Controller, Post, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UnifiedLoginDto } from '../models/auth.dto';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: UnifiedLoginDto) {
    const user = await this.authService.validateUser(loginDto.usuario, loginDto.senha);
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Usuário ou senha incorretos',
          error: 'Credenciais inválidas'
        },
        HttpStatus.UNAUTHORIZED
      );
    }
    
    const token = await this.authService.generateToken(user);
    return { 
      message: 'Login realizado com sucesso', 
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        usuario: user.usuario,
        role: user.role
      }
    };
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'mesario')
  @Post('logout')
  async logout(@Request() req) {
    const user = req.user;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    console.log('🚪 Logout - Usuário:', user);
    console.log('🚪 Logout - Token:', token ? token.substring(0, 20) + '...' : 'Nenhum token');
    
    if (token) {
      await this.authService.invalidateSpecificToken(token);
    }
    
    return { 
      message: 'Logout realizado com sucesso',
      user: user ? {
        id: user.id,
        nome: user.nome,
        role: user.role
      } : null
    };
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'mesario')
  @Post('refresh')
  async refresh(@Request() req) {
    const user = req.user;
    const newToken = await this.authService.generateToken(user);
    return { 
      message: 'Token renovado com sucesso', 
      token: newToken,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        usuario: user.usuario,
        role: user.role
      }
    };
  }
}
