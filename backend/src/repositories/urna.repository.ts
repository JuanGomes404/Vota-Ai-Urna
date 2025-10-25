import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/src/prisma.service';
import { VotoDto } from '../models/voto.dto';

@Injectable()
export class UrnaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Listar eleições ativas para a urna
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
        ativa: true
      }
    });
  }

  // Buscar dados de uma eleição específica
  async buscarEleicao(eleicaoId: string) {
    return await this.prisma.eleicao.findUnique({
      where: { id: eleicaoId },
      select: {
        id: true,
        nome: true,
        descricao: true,
        status: true,
        ativa: true
      }
    });
  }

  // RN03: Só exibe chapas se eleição estiver ativa
  async findChapasByElectionId(eleicaoId: string) {
    const eleicao = await this.prisma.eleicao.findUnique({
      where: { id: eleicaoId }
    });

    if (!eleicao?.ativa) {
      throw new Error("Eleição não está ativa para votação");
    }

    return await this.prisma.chapa.findMany({
      where: { eleicaoId: eleicaoId },
      orderBy: { numero: 'asc' }
    });
  }

  // RN11: Validar credencial antes do uso (incluindo verificação de expiração)
  async findCredencialByToken(token: string) {
    const credencial = await this.prisma.credencial.findUnique({
      where: { token }
    });

    // Verificar se a credencial expirou
    if (credencial && !credencial.usada && credencial.expiresAt < new Date()) {
      // Marcar credencial como usada se expirou
      await this.prisma.credencial.update({
        where: { token },
        data: { usada: true }
      });
      return null; // Retornar null para indicar credencial inválida
    }

    return credencial;
  }

  // RN10: Registro anônimo de voto (sem dados pessoais)
  async registrarVoto(voto: VotoDto) {
    // Encontrar credencial pelo token
    const credencial = await this.prisma.credencial.findUnique({
      where: { token: voto.token },
    });
    if (!credencial) throw new Error('Credencial inválida');
    
    // Determinar tipo de voto
    let tipo = 'valido';
    let chapaId = voto.chapaId;

    if (voto.tipo === 'branco' || !voto.chapaId) {
      tipo = voto.tipo || 'branco';
      chapaId = null;
    } else if (voto.tipo === 'nulo') {
      tipo = 'nulo';
      chapaId = null;
    }

    // Registrar voto
    const votoCriado = await this.prisma.voto.create({
      data: {
        eleicaoId: voto.eleicaoId,
        chapaId: chapaId,
        tipo: tipo
      },
    });
    // Marcar eleitor como já votou
    await this.prisma.eleitor.update({
      where: { id: credencial.eleitorId },
      data: { jaVotou: true },
    });
    return votoCriado;
  }

  // RN11: Invalidação permanente da credencial
  async invalidarCredencial(token: string) {
    return await this.prisma.credencial.update({
      where: { token },
      data: { usada: true }
    });
  }

  // RN08: Verificar se eleitor foi habilitado por mesário
  async verificarHabilitacaoEleitor(token: string) {
    const credencial = await this.prisma.credencial.findUnique({
      where: { token },
      include: {
        eleitor: true,
        eleicao: true
      }
    });

    if (!credencial) {
      return { error: "Credencial não encontrada" };
    }

    if (credencial.usada) {
      return { error: "Credencial já foi utilizada" };
    }

    if (!credencial.eleicao.ativa) {
      return { error: "Eleição não está ativa" };
    }

    return { valid: true, credencial };
  }
}
