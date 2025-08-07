import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'ID da empresa do usuário',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  company_id?: number;

  @ApiPropertyOptional({
    description: 'Nome de usuário',
    example: 'joaosilva_novo',
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    description: 'Email do usuário',
    example: 'joao.silva_novo@email.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Senha do usuário',
    example: 'novaSenhaSegura456',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'ID do papel/função do usuário no sistema',
    example: 2,
  })
  @IsInt()
  @IsOptional()
  role_id?: number;
}
