import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repositories/admin.repository';
import { LoginDto, EleicaoDto, ChapaDto } from '../models/admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async login(loginDto: LoginDto) {
    const admin = await this.adminRepository.findByEmail(loginDto.email);
    if (admin && admin.senha === loginDto.senha) {
      return { message: 'Login realizado com sucesso', admin };
    }
    return { error: 'Credenciais inválidas' };
  }

  async listarEleicoes() {
    return await this.adminRepository.listarEleicoes();
  }

  async criarEleicao(eleicaoDto: EleicaoDto) {
    return await this.adminRepository.criarEleicao(eleicaoDto);
  }

  async criarChapa(chapaDto: ChapaDto) {
    return await this.adminRepository.criarChapa(chapaDto);
  }

  async importarEleitores(eleitores: any[]) {
    return await this.adminRepository.importarEleitores(eleitores);
  }

  async ativarEleicao(eleicaoId: string) {
    return await this.adminRepository.ativarEleicao(eleicaoId);
  }

  async encerrarEleicao(eleicaoId: string) {
    return await this.adminRepository.encerrarEleicao(eleicaoId);
  }

  async visualizarResultado(eleicaoId: string) {
    try {
      return await this.adminRepository.visualizarResultado(eleicaoId);
    } catch (error) {
      return { error: error.message };
    }
  }
}
