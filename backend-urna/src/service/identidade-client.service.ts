import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class IdentidadeClientService {
  constructor(private readonly httpService: HttpService) {}

  async validarIdentidade(token: string): Promise<any> {
    // Exemplo de chamada ao microserviço de identidade
    return this.httpService.post('http://localhost:3001/identidade/validar', { token }).toPromise();
  }
  async invalidarCredencial(token: string): Promise<any> {
    // Exemplo de chamada ao microserviço de identidade para invalidar credencial
    return this.httpService.patch('http://localhost:3001/credenciais/invalidate', { token }).toPromise();
  }
}
