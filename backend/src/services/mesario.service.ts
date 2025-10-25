import { Injectable } from '@nestjs/common';
import { MesarioRepository } from '../repositories/mesario.repository';

@Injectable()
export class MesarioService {
  constructor(private readonly mesarioRepository: MesarioRepository) {}

  async login(usuario: string, senha: string) {
    const mesario = await this.mesarioRepository.findByUsuario(usuario);
    if (mesario && mesario.senha === senha) {
      return { message: 'Login realizado com sucesso', mesario };
    }
    return { error: 'Credenciais inválidas' };
  }

  // Listar eleições ativas
  async listarEleicoesAtivas() {
    const eleicoes = await this.mesarioRepository.listarEleicoesAtivas();
    return { eleicoes };
  }

  // RN05: Buscar apenas eleitores da lista oficial
  async buscarEleitor(matricula: string, eleicaoId: string) {
    const eleitor = await this.mesarioRepository.findEleitorByMatricula(matricula, eleicaoId);
    if (!eleitor) {
      return { error: 'Eleitor não encontrado na lista oficial desta eleição' };
    }
    
    const status = eleitor.jaVotou ? 'Já Votou' : 'Apto a Votar';
    return { eleitor, status };
  }

  // RN06, RN07, RN08, RN09: Habilitação com todas as validações
  async habilitarEleitor(matricula: string, eleicaoId: string) {
    const eleitor = await this.mesarioRepository.findEleitorByMatricula(matricula, eleicaoId);
    if (!eleitor) {
      return { error: 'Eleitor não encontrado na lista oficial desta eleição' };
    }
    
    // RN06: Verificar se já votou
    if (eleitor.jaVotou) {
      return { error: 'Eleitor já votou - RN07: Status irreversível' };
    }

    // RN08: Verificar se já foi habilitado (com credencial válida e não expirada)
    const jaHabilitado = await this.mesarioRepository.verificarHabilitacao(eleitor.id, eleitor.eleicaoId);
    if (jaHabilitado) {
      return { error: 'Eleitor já possui uma credencial válida para esta eleição' };
    }

    // RN09: Gerar credencial de uso único com validade de 5 minutos
    const credencial = await this.mesarioRepository.gerarCredencial(eleitor.id, eleitor.eleicaoId);
    
    // Nota: O status "já votou" só será marcado após a confirmação do voto na urna
    
    return { 
      message: 'Eleitor habilitado com sucesso', 
      credencial: credencial.token,
      expiresAt: credencial.expiresAt
    };
  }

  // Listar todos os eleitores aptos a votar (ordenados alfabeticamente)
  async listarEleitoresAptos(eleicaoId: string) {
    const eleitores = await this.mesarioRepository.listarEleitoresAptos(eleicaoId);
    return { eleitores };
  }
}
