import { Module } from '@nestjs/common';
import { TaskAssigneesService } from './task_assignees.service';
import { TaskAssigneesController } from './task_assignee.controller';

@Module({
  controllers: [TaskAssigneesController],
  providers: [TaskAssigneesService],
})
export class TaskAssigneesModule {}
