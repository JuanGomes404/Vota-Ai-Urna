import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EleicaoDto, ChapaDto } from '../models/admin.dto';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.administrador.findUnique({
      where: { email }
    });
  }

  async listarEleicoes() {
    return await this.prisma.eleicao.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async buscarEleicao(eleicaoId: string) {
    return await this.prisma.eleicao.findUnique({
      where: { id: eleicaoId },
      include: {
        chapas: true,
        eleitores: true,
        votos: {
          include: {
            chapa: true
          }
        }
      }
    });
  }

  // RN01: Apenas administrador pode criar eleições
  async criarEleicao(eleicaoDto: EleicaoDto) {
    return await this.prisma.eleicao.create({
      data: {
        nome: eleicaoDto.nome,
        descricao: eleicaoDto.descricao,
        ativa: false, // RN03: Eleição inicia como inativa
        status: "Criada"
      }
    });
  }

  // RN02: Eleição deve ter chapas
  async criarChapa(chapaDto: ChapaDto) {
    return await this.prisma.chapa.create({
      data: {
        nome: chapaDto.nome,
        numero: parseInt(chapaDto.numero),
        eleicaoId: chapaDto.eleicaoId
      }
    });
  }

  /**
   * Deletar chapa
   * Verifica se a eleição está ativa antes de permitir exclusão
   */
  async deletarChapa(chapaId: string) {
    // Buscar chapa para verificar eleição
    const chapa = await this.prisma.chapa.findUnique({
      where: { id: chapaId },
      include: { eleicao: true }
    });

    if (!chapa) {
      throw new Error('Chapa não encontrada');
    }

    // RN03: Não permitir exclusão se eleição está ativa
    if (chapa.eleicao.ativa) {
      throw new Error('Não é possível remover chapa de uma eleição ativa');
    }

    // Verificar se há votos para esta chapa
    const votosCount = await this.prisma.voto.count({
      where: { chapaId: chapaId }
    });

    if (votosCount > 0) {
      throw new Error('Não é possível remover chapa que já possui votos');
    }

    // Deletar chapa
    return await this.prisma.chapa.delete({
      where: { id: chapaId }
    });
  }

  // RN02: Eleição deve ter lista de eleitores
  async importarEleitores(eleitores: any[]) {
    const eleitoresProcessados = [];
    const erros = [];
    
    for (const eleitor of eleitores) {
      try {
        // Verificar se eleitor já existe NESTA ELEIÇÃO (matrícula + eleicaoId)
        const eleitorExistente = await this.prisma.eleitor.findUnique({
          where: {
            matricula_eleicaoId: {
              matricula: eleitor.matricula,
              eleicaoId: eleitor.eleicaoId
            }
          }
        });
        
        let eleitorProcessado;
        let status;
        
        if (eleitorExistente) {
          // Atualizar eleitor existente nesta eleição
          eleitorProcessado = await this.prisma.eleitor.update({
            where: {
              matricula_eleicaoId: {
                matricula: eleitor.matricula,
                eleicaoId: eleitor.eleicaoId
              }
            },
            data: {
              nome: eleitor.nome,
              curso: eleitor.curso,
              // Não alterar jaVotou se já existe
            }
          });
          status = 'atualizado';
        } else {
          // Criar novo eleitor nesta eleição
          eleitorProcessado = await this.prisma.eleitor.create({
            data: {
              nome: eleitor.nome,
              matricula: eleitor.matricula,
              curso: eleitor.curso,
              eleicaoId: eleitor.eleicaoId,
              jaVotou: false
            }
          });
          status = 'criado';
        }
        
        eleitoresProcessados.push({
          ...eleitorProcessado,
          status: status
        });
      } catch (error) {
        erros.push({
          matricula: eleitor.matricula,
          nome: eleitor.nome,
          erro: error.message
        });
      }
    }
    
    return {
      eleitores: eleitoresProcessados,
      erros: erros,
      totalProcessados: eleitoresProcessados.length,
      totalErros: erros.length
    };
  }

  // RN03: Ativar eleição para permitir votação
  async ativarEleicao(eleicaoId: string) {
    return await this.prisma.eleicao.update({
      where: { id: eleicaoId },
      data: { 
        ativa: true,
        status: "Ativa"
      }
    });
  }

  // RN04: Encerrar eleição para visualizar resultados
  async encerrarEleicao(eleicaoId: string) {
    return await this.prisma.eleicao.update({
      where: { id: eleicaoId },
      data: { 
        ativa: false,
        status: "Encerrada"
      }
    });
  }

  // RN04: Resultados só após eleição encerrada
  async visualizarResultado(eleicaoId: string) {
    const eleicao = await this.prisma.eleicao.findUnique({
      where: { id: eleicaoId },
      include: {
        eleitores: true
      }
    });

    if (eleicao.status !== "Encerrada") {
      throw new Error("Resultados só podem ser visualizados após eleição encerrada");
    }

    const votos = await this.prisma.voto.findMany({
      where: { eleicaoId },
      include: {
        chapa: true
      }
    });

    const chapas = await this.prisma.chapa.findMany({
      where: { eleicaoId },
      orderBy: { numero: 'asc' }
    });

    // Contar votos por tipo
    let votosValidos = 0;
    let votosBrancos = 0;
    let votosNulos = 0;
    const resultadoChapas = {};

    votos.forEach(voto => {
      if (voto.tipo === 'branco') {
        votosBrancos++;
      } else if (voto.tipo === 'nulo') {
        votosNulos++;
      } else if (voto.chapa) {
        votosValidos++;
        const chapaId = voto.chapa.id;
        resultadoChapas[chapaId] = (resultadoChapas[chapaId] || 0) + 1;
      }
    });

    // Formatar resultado por chapa
    const resultadoFormatado = chapas.map(chapa => ({
      id: chapa.id,
      nome: chapa.nome,
      numero: chapa.numero,
      votos: resultadoChapas[chapa.id] || 0,
      percentual: votosValidos > 0 ? ((resultadoChapas[chapa.id] || 0) / votosValidos * 100) : 0
    }));

    // Calcular abstenções
    const totalEleitores = eleicao.eleitores.length;
    const totalVotos = votos.length;
    const abstencoes = totalEleitores - totalVotos;

    return {
      eleicao: {
        id: eleicao.id,
        nome: eleicao.nome
      },
      totalEleitores,
      totalVotos,
      votosValidos,
      votosBrancos,
      votosNulos,
      abstencoes,
      chapas: resultadoFormatado
    };
  }

  // Verificar se eleição está ativa
  async isEleicaoAtiva(eleicaoId: string) {
    const eleicao = await this.prisma.eleicao.findUnique({
      where: { id: eleicaoId }
    });
    return eleicao?.ativa || false;
  }
}
