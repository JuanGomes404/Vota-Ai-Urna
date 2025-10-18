import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UnifiedLoginDto } from '../models/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: UnifiedLoginDto) {
    const user = await this.authService.validateUser(loginDto.usuario, loginDto.senha);
    if (!user) {
      return { error: 'Credenciais inválidas' };
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
}
