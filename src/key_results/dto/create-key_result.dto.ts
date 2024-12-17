import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateKeyResultDto {
  @IsNumber()
  @IsNotEmpty()
  objective_id: number;

  @IsString()
  @IsNotEmpty()
  key_result_name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  start_date: Date;

  @IsString()
  @IsNotEmpty()
  end_date: Date;
}
