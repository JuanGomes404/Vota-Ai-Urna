import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/src/prisma.service';
import { EleicaoDto, ChapaDto } from '../models/admin.dto';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.administrador.findUnique({
      where: { email }
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
        numero: chapaDto.numero,
        eleicaoId: chapaDto.eleicaoId
      }
    });
  }

  // RN02: Eleição deve ter lista de eleitores
  async importarEleitores(eleitores: any[]) {
    const eleitoresCriados = [];
    for (const eleitor of eleitores) {
      const eleitorCriado = await this.prisma.eleitor.create({
        data: {
          nome: eleitor.nome,
          matricula: eleitor.matricula,
          eleicaoId: eleitor.eleicaoId,
          jaVotou: false
        }
      });
      eleitoresCriados.push(eleitorCriado);
    }
    return eleitoresCriados;
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
      where: { id: eleicaoId }
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

    const resultado = {};
    votos.forEach(voto => {
      const chapaNome = voto.chapa.nome;
      resultado[chapaNome] = (resultado[chapaNome] || 0) + 1;
    });

    return {
      eleicaoId,
      totalVotos: votos.length,
      resultado
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
