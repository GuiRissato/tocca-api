
import { IsNotEmpty, IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsNumber()
  key_result_id: number;

  @IsNotEmpty()
  @IsString()
  task_name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  delay_reason: string;

  @IsOptional()
  @IsNumber()
  priority: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  due_date: Date;

  @IsNotEmpty()
  @IsNumber()
  column_key_result_id: number;
}
