import { IsString, IsNotEmpty } from 'class-validator';

export class MesarioLoginDto {
  @IsString()
  @IsNotEmpty()
  usuario!: string;

  @IsString()
  @IsNotEmpty()
  senha!: string;
}

export class BuscarEleitorDto {
  @IsString()
  @IsNotEmpty()
  matricula!: string;
}

export class HabilitarEleitorDto {
  @IsString()
  @IsNotEmpty()
  matricula!: string;
}
