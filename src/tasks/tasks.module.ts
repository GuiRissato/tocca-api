import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from './entities/task.entity';
import { ColumnsKeyResults } from 'src/columns_key_result/entities/columns_key_result.entity';
import { ColumnsKeyResultService } from 'src/columns_key_result/columns_key_result.service';
import { KeyResults } from 'src/key_results/entities/key_result.entity';
import { KeyResultsService } from 'src/key_results/key_results.service';
import { TaskTags } from 'src/task_tags/entities/task_tag.entity';
import { TaskAssignees } from 'src/task_assingees/entities/task_assignee.entity';
import { TaskTagsService } from 'src/task_tags/task_tags.service';
import { TaskAssigneesService } from 'src/task_assingees/task_assignees.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tasks, ColumnsKeyResults, KeyResults, TaskTags, TaskAssignees])],
  controllers: [TasksController],
  providers: [TasksService, ColumnsKeyResultService, KeyResultsService, TaskTagsService, TaskAssigneesService],
})
export class TasksModule {}
