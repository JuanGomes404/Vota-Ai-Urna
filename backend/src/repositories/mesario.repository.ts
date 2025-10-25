import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/src/prisma.service';

@Injectable()
export class MesarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsuario(usuario: string) {
    return await this.prisma.mesario.findUnique({
      where: { usuario }
    });
  }

  // Listar eleições ativas (com dados de auditoria - RNF05)
  async listarEleicoesAtivas() {
    return await this.prisma.eleicao.findMany({
      where: { 
        ativa: true,
        status: 'Ativa'
      },
      select: {
        id: true,
        nome: true,
        descricao: true,
        status: true,
        ativa: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  // RN05: Apenas eleitores da lista oficial podem ser habilitados
  async findEleitorByMatricula(matricula: string, eleicaoId: string) {
    return await this.prisma.eleitor.findUnique({
      where: { 
        matricula_eleicaoId: {
          matricula,
          eleicaoId
        }
      }
    });
  }

  // RN06: Verificar se eleitor já votou
  async isEleitorJaVotou(matricula: string, eleicaoId: string) {
    const eleitor = await this.prisma.eleitor.findUnique({
      where: { 
        matricula_eleicaoId: {
          matricula,
          eleicaoId
        }
      }
    });
    return eleitor?.jaVotou || false;
  }

  // RN09: Gerar credencial de uso único com validade de 5 minutos
  async gerarCredencial(eleitorId: string, eleicaoId: string) {
    // Gerar token numérico de 6 dígitos (mais fácil de digitar)
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Definir expiração para 5 minutos a partir de agora
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);
    
    return await this.prisma.credencial.create({
      data: {
        token,
        eleitorId,
        eleicaoId,
        usada: false,
        expiresAt
      }
    });
  }

  // RN07: Marcar eleitor como votou (irreversível)
  async marcarEleitorComoVotou(eleitorId: string) {
    return await this.prisma.eleitor.update({
      where: { id: eleitorId },
      data: { jaVotou: true }
    });
  }

  // RN08: Verificar se eleitor está habilitado para votar (com credencial válida e não expirada)
  async verificarHabilitacao(eleitorId: string, eleicaoId: string) {
    const credencial = await this.prisma.credencial.findFirst({
      where: {
        eleitorId,
        eleicaoId,
        usada: false,
        expiresAt: {
          gt: new Date() // Credencial não expirada
        }
      }
    });
    return !!credencial;
  }

  // Listar todos os eleitores aptos a votar em uma eleição (ordenados alfabeticamente)
  async listarEleitoresAptos(eleicaoId: string) {
    return await this.prisma.eleitor.findMany({
      where: {
        eleicaoId
      },
      orderBy: {
        nome: 'asc'
      },
      select: {
        id: true,
        nome: true,
        matricula: true,
        curso: true,
        jaVotou: true
      }
    });
  }

  // Invalidar credenciais expiradas (não usadas)
  async invalidarCredenciaisExpiradas() {
    return await this.prisma.credencial.updateMany({
      where: {
        usada: false,
        expiresAt: {
          lt: new Date()
        }
      },
      data: {
        usada: true
      }
    });
  }
}
