import {    IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTaskTagDto {
    @IsNotEmpty()
     @IsNumber()
     task_id: number;

     @IsNotEmpty()
     @IsNumber()
     tag_id: number;
}
