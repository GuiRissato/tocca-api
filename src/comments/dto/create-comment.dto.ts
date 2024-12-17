import { IsNotEmpty, IsString, IsNumber } from "class-validator";
export class CreateCommentDto {
    @IsNotEmpty()
    @IsNumber()
    task_id: number;

    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    @IsString()
    commet_text: string;
}
