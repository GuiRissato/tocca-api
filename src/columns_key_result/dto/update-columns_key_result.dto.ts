import { PartialType } from '@nestjs/mapped-types';
import { CreateColumnsKeyResultDto } from './create-columns_key_result.dto';

export class UpdateColumnsKeyResultDto extends PartialType(CreateColumnsKeyResultDto) {}
