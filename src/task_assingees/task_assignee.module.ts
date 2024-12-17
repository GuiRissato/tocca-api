import { Module } from '@nestjs/common';
import { TaskAssigneesService } from './task_assignees.service';
import { TaskAssigneesController } from './task_assignee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAssignees } from './entities/task_assignee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskAssignees])],
  controllers: [TaskAssigneesController],
  providers: [TaskAssigneesService],
})
export class TaskAssigneesModule {}
