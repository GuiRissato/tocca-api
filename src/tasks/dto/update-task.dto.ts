import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    description: 'ID do resultado-chave associado à tarefa',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  key_result_id?: number;

  @ApiPropertyOptional({
    description: 'Nome da tarefa',
    example: 'Implementar autenticação JWT (atualizado)',
  })
  @IsOptional()
  @IsString()
  task_name?: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da tarefa',
    example: 'Criar sistema de autenticação usando tokens JWT para garantir segurança nas requisições - versão atualizada',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Motivo do atraso na tarefa, se houver',
    example: 'Dependência de serviço externo não disponível - problema resolvido',
  })
  @IsOptional()
  @IsString()
  delay_reason?: string;

  @ApiPropertyOptional({
    description: 'Nível de prioridade da tarefa (quanto maior o número, maior a prioridade)',
    example: 4,
  })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional({
    description: 'Data de vencimento da tarefa',
    example: '2024-01-15T23:59:59Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  due_date?: Date;

  @ApiPropertyOptional({
    description: 'ID da coluna do resultado-chave onde a tarefa está posicionada',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  column_key_result_id?: number;
}
