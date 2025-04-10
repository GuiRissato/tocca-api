import { Module } from '@nestjs/common';
import { OkrProjectsService } from './okr_projects.service';
import { OkrProjectsController } from './okr_projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OkrProjects } from './entities/okr_project.entity';
import { ObjectivesService } from 'src/objectives/objectives.service';
import { Objectives } from 'src/objectives/entities/objective.entity';
import { KeyResults } from 'src/key_results/entities/key_result.entity';
import { KeyResultsService } from 'src/key_results/key_results.service';
import { Tasks } from 'src/tasks/entities/task.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { ColumnsKeyResults } from 'src/columns_key_result/entities/columns_key_result.entity';
import { ColumnsKeyResultService } from 'src/columns_key_result/columns_key_result.service';
import { TaskTagsService } from 'src/task_tags/task_tags.service';
import { TaskAssignees } from 'src/task_assingees/entities/task_assignee.entity';
import { TaskAssigneesService } from 'src/task_assingees/task_assignees.service';
import { TaskTags } from 'src/task_tags/entities/task_tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OkrProjects, Objectives, KeyResults, Tasks, ColumnsKeyResults, TaskTags, TaskAssignees])],
  controllers: [OkrProjectsController],
  providers: [OkrProjectsService, ObjectivesService, KeyResultsService, TasksService, ColumnsKeyResultService, TaskTagsService, TaskAssigneesService],
})
export class OkrProjectsModule {}
