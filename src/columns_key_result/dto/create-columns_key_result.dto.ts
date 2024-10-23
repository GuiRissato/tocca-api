import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateColumnsKeyResultDto {
  @IsNotEmpty()
  @IsNumber()
  key_result_id: number;

  @IsNotEmpty()
  @IsString()
  column_name: string;

  @IsNotEmpty()
  @IsString()
  position: number;
}
