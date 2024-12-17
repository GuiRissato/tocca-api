import { PartialType } from '@nestjs/mapped-types';
import { CreateOkrProjectDto } from './create-okr_project.dto';

export class UpdateOkrProjectDto extends PartialType(CreateOkrProjectDto) {}
