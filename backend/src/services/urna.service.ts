import { Injectable } from '@nestjs/common';
import { VotoDto } from '../models/voto.dto';
import { UrnaRepository } from '../repositories/urna.repository';

@Injectable()
export class UrnaService {
  constructor(private readonly urnaRepository: UrnaRepository) {}

  async listarEleicoesAtivas() {
    const eleicoes = await this.urnaRepository.listarEleicoesAtivas();
    return { eleicoes };
  }

  async buscarEleicao(eleicaoId: string) {
    const eleicao = await this.urnaRepository.buscarEleicao(eleicaoId);
    if (!eleicao) {
      return { error: 'Eleição não encontrada' };
    }
    return { eleicao };
  }

  async validarCredencial(token: string, eleicaoId: string) {
    const credencial = await this.urnaRepository.findCredencialByToken(token);
    if (!credencial) {
      return { error: 'Credencial inválida ou expirada. Por favor, solicite uma nova credencial ao mesário.' };
    }
    
    if (credencial.usada) {
      return { error: 'Credencial já foi utilizada' };
    }

    // Verificar se a credencial expirou
    if (credencial.expiresAt < new Date()) {
      return { error: 'Credencial expirada. Por favor, solicite uma nova credencial ao mesário.' };
    }

    // Verificar se a credencial é para a eleição selecionada
    if (credencial.eleicaoId !== eleicaoId) {
      return { error: 'Esta credencial não é válida para a eleição selecionada' };
    }
    
    return { message: 'Credencial válida', valid: true, eleicaoId: credencial.eleicaoId };
  }

  async confirmarVoto(votoDto: VotoDto) {
    const credencial = await this.urnaRepository.findCredencialByToken(votoDto.token);
    if (!credencial || credencial.usada) {
      return { error: 'Credencial inválida' };
    }
    try {
      await this.urnaRepository.registrarVoto(votoDto);
      await this.urnaRepository.invalidarCredencial(votoDto.token);
      return { message: 'Voto registrado com sucesso!' };
    } catch (error) {
      return { error: 'Erro ao registrar voto: ' + (error.message || error) };
    }
  }

  async listarChapas(eleicaoId: string) {
    return await this.urnaRepository.findChapasByElectionId(eleicaoId);
  }
}
