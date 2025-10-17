import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  senha!: string;
}

export class EleicaoDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsString()
  @IsNotEmpty()
  descricao!: string;
}

export class ChapaDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsString()
  @IsNotEmpty()
  numero!: string;

  @IsString()
  @IsNotEmpty()
  eleicaoId!: string;
}

export class EleitorDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsString()
  @IsNotEmpty()
  matricula!: string;

  @IsString()
  @IsNotEmpty()
  eleicaoId!: string;
}
