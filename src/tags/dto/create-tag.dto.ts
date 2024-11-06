import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTagDto {
    @IsNotEmpty()
    @IsString()
    tag_name: string;

    @IsNotEmpty()
    @IsNumber()
    company_id: number;
}