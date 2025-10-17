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

  // RN05: Buscar apenas eleitores da lista oficial
  async buscarEleitor(matricula: string) {
    const eleitor = await this.mesarioRepository.findEleitorByMatricula(matricula);
    if (!eleitor) {
      return { error: 'Eleitor não encontrado na lista oficial' };
    }
    
    const status = eleitor.jaVotou ? 'Já Votou' : 'Apto a Votar';
    return { eleitor, status };
  }

  // RN06, RN07, RN08, RN09: Habilitação com todas as validações
  async habilitarEleitor(matricula: string) {
    const eleitor = await this.mesarioRepository.findEleitorByMatricula(matricula);
    if (!eleitor) {
      return { error: 'Eleitor não encontrado na lista oficial' };
    }
    
    // RN06: Verificar se já votou
    if (eleitor.jaVotou) {
      return { error: 'Eleitor já votou - RN07: Status irreversível' };
    }

    // RN08: Verificar se já foi habilitado
    const jaHabilitado = await this.mesarioRepository.verificarHabilitacao(eleitor.id, eleitor.eleicaoId);
    if (jaHabilitado) {
      return { error: 'Eleitor já foi habilitado para esta eleição' };
    }

    // RN09: Gerar credencial de uso único
    const credencial = await this.mesarioRepository.gerarCredencial(eleitor.id, eleitor.eleicaoId);
    
    // RN07: Marcar como votou (irreversível)
    await this.mesarioRepository.marcarEleitorComoVotou(eleitor.id);
    
    return { 
      message: 'Eleitor habilitado com sucesso', 
      credencial: credencial.token 
    };
  }
}
