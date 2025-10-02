import { IsString, IsEmail, IsDateString, IsOptional, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  nome: string;

  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @MaxLength(255, { message: 'Email deve ter no máximo 255 caracteres' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Transform(({ value }) => value?.replace(/\D/g, '')) // Remove caracteres não numéricos
  @MinLength(10, { message: 'Telefone deve ter pelo menos 10 dígitos' })
  @MaxLength(11, { message: 'Telefone deve ter no máximo 11 dígitos' })
  telefone: string;

  @IsString()
  @IsNotEmpty({ message: 'Cargo é obrigatório' })
  @MinLength(2, { message: 'Cargo deve ter pelo menos 2 caracteres' })
  @MaxLength(255, { message: 'Cargo deve ter no máximo 255 caracteres' })
  cargo: string;

  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  data_nascimento: string;

  @IsString()
  @IsNotEmpty({ message: 'Mensagem é obrigatória' })
  @MinLength(10, { message: 'Mensagem deve ter pelo menos 10 caracteres' })
  @MaxLength(1000, { message: 'Mensagem deve ter no máximo 1000 caracteres' })
  mensagem: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'UTM Source deve ter no máximo 255 caracteres' })
  utm_source?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'UTM Medium deve ter no máximo 255 caracteres' })
  utm_medium?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'UTM Campaign deve ter no máximo 255 caracteres' })
  utm_campaign?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'UTM Term deve ter no máximo 255 caracteres' })
  utm_term?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'UTM Content deve ter no máximo 255 caracteres' })
  utm_content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'GCLID deve ter no máximo 255 caracteres' })
  gclid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'FBCLID deve ter no máximo 255 caracteres' })
  fbclid?: string;
}
