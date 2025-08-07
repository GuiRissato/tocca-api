import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskTagDto {
    @ApiProperty({
        description: 'ID da tarefa que será associada à tag',
        example: 1,
        type: Number,
    })
    @IsNotEmpty()
    @IsNumber()
    task_id: number;

    @ApiProperty({
        description: 'ID da tag que será associada à tarefa',
        example: 2,
        type: Number,
    })
    @IsNotEmpty()
    @IsNumber()
    tag_id: number;
}
