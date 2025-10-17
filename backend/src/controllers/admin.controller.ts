import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { LoginDto, EleicaoDto, ChapaDto } from '../models/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.adminService.login(loginDto);
  }

  @Post('eleicoes')
  async criarEleicao(@Body() eleicaoDto: EleicaoDto) {
    return await this.adminService.criarEleicao(eleicaoDto);
  }

  @Post('chapas')
  async criarChapa(@Body() chapaDto: ChapaDto) {
    return await this.adminService.criarChapa(chapaDto);
  }

  @Post('eleitores/importar')
  async importarEleitores(@Body() eleitores: any[]) {
    return await this.adminService.importarEleitores(eleitores);
  }

  @Post('eleicoes/:id/ativar')
  async ativarEleicao(@Param('id') eleicaoId: string) {
    return await this.adminService.ativarEleicao(eleicaoId);
  }

  @Post('eleicoes/:id/encerrar')
  async encerrarEleicao(@Param('id') eleicaoId: string) {
    return await this.adminService.encerrarEleicao(eleicaoId);
  }

  @Get('eleicoes/:id/resultado')
  async visualizarResultado(@Param('id') eleicaoId: string) {
    return await this.adminService.visualizarResultado(eleicaoId);
  }
}
