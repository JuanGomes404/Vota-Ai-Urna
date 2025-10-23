import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { EleicaoDto, ChapaDto } from '../models/admin.dto';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('eleicoes')
  async listarEleicoes() {
    return await this.adminService.listarEleicoes();
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post('eleicoes')
  async criarEleicao(@Body() eleicaoDto: EleicaoDto) {
    return await this.adminService.criarEleicao(eleicaoDto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post('chapas')
  async criarChapa(@Body() chapaDto: ChapaDto) {
    return await this.adminService.criarChapa(chapaDto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post('eleitores/importar')
  async importarEleitores(@Body() eleitores: any[]) {
    return await this.adminService.importarEleitores(eleitores);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('eleicoes/:id')
  async buscarEleicao(@Param('id') eleicaoId: string) {
    return await this.adminService.buscarEleicao(eleicaoId);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post('eleicoes/:id/ativar')
  async ativarEleicao(@Param('id') eleicaoId: string) {
    return await this.adminService.ativarEleicao(eleicaoId);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post('eleicoes/:id/encerrar')
  async encerrarEleicao(@Param('id') eleicaoId: string) {
    return await this.adminService.encerrarEleicao(eleicaoId);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('eleicoes/:id/resultado')
  async visualizarResultado(@Param('id') eleicaoId: string) {
    return await this.adminService.visualizarResultado(eleicaoId);
  }
}
