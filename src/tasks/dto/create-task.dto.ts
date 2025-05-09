
import { IsNotEmpty, IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'ID do resultado-chave associado à tarefa',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  key_result_id: number;

  @ApiProperty({
    description: 'Nome da tarefa',
    example: 'Implementar autenticação JWT',
  })
  @IsNotEmpty()
  @IsString()
  task_name: string;

  @ApiProperty({
    description: 'Descrição detalhada da tarefa',
    example: 'Criar sistema de autenticação usando tokens JWT para garantir segurança nas requisições',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Motivo do atraso na tarefa, se houver',
    example: 'Dependência de serviço externo não disponível',
    required: false,
  })
  @IsOptional()
  @IsString()
  delay_reason: string;

  @ApiProperty({
    description: 'Nível de prioridade da tarefa (quanto maior o número, maior a prioridade)',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  priority: number;

  @ApiProperty({
    description: 'Data de vencimento da tarefa',
    example: '2023-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  due_date: Date;

  @ApiProperty({
    description: 'ID da coluna do resultado-chave onde a tarefa está posicionada',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  column_key_result_id: number;
}
