import { Module } from '@nestjs/common';
import { TaskAssigneesService } from './task_assignees.service';
import { TaskAssigneesController } from './task_assignee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAssignee } from './entities/task_assignee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskAssignee])],
  controllers: [TaskAssigneesController],
  providers: [TaskAssigneesService],
})
export class TaskAssigneesModule {}
