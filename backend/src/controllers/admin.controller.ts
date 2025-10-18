import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../auth/auth.service';
import { LoginDto, EleicaoDto, ChapaDto } from '../models/admin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateAdmin(loginDto.email, loginDto.senha);
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
        role: user.role
      }
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('eleicoes')
  async criarEleicao(@Body() eleicaoDto: EleicaoDto) {
    return await this.adminService.criarEleicao(eleicaoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('chapas')
  async criarChapa(@Body() chapaDto: ChapaDto) {
    return await this.adminService.criarChapa(chapaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('eleitores/importar')
  async importarEleitores(@Body() eleitores: any[]) {
    return await this.adminService.importarEleitores(eleitores);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('eleicoes/:id/ativar')
  async ativarEleicao(@Param('id') eleicaoId: string) {
    return await this.adminService.ativarEleicao(eleicaoId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('eleicoes/:id/encerrar')
  async encerrarEleicao(@Param('id') eleicaoId: string) {
    return await this.adminService.encerrarEleicao(eleicaoId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('eleicoes/:id/resultado')
  async visualizarResultado(@Param('id') eleicaoId: string) {
    return await this.adminService.visualizarResultado(eleicaoId);
  }
}
