import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskAssigneeDto } from './create-task_assignee.dto';

export class UpdateTaskAssigneeDto extends PartialType(CreateTaskAssigneeDto) {}
