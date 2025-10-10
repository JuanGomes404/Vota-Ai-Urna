import { Controller, Post, Body } from '@nestjs/common';
import { VotoDto } from '../model/voto.dto';
import { UrnaService } from '../service/urna.service';

@Controller('urna')
export class UrnaController {
  constructor(private readonly urnaService: UrnaService) {}

  @Post('votar')
  votar(@Body() votoDto: VotoDto) {
    return this.urnaService.registrarVoto(votoDto);
  }
}
