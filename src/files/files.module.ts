import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { Objectives } from '../objectives/entities/objective.entity';
import { OkrProjects } from '../okr_projects/entities/okr_project.entity';
import { KeyResults } from '../key_results/entities/key_result.entity';
import { Users } from '../users/entities/user.entity';
import { ColumnsKeyResults } from '../columns_key_result/entities/columns_key_result.entity';
import { ObjectivesService } from '../objectives/objectives.service';
import { KeyResultsService } from '../key_results/key_results.service';
import { TasksService } from '../tasks/tasks.service';
import { ColumnsKeyResultService } from '../columns_key_result/columns_key_result.service';
import { OkrProjectsService } from '../okr_projects/okr_projects.service';
import { Tasks } from 'src/tasks/entities/task.entity';
import { TaskAssignees } from 'src/task_assingees/entities/task_assignee.entity';
import { TaskTags } from 'src/task_tags/entities/task_tag.entity';
import { TaskAssigneesService } from 'src/task_assingees/task_assignees.service';
import { TaskTagsService } from 'src/task_tags/task_tags.service';
import { FilesController } from './files.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Objectives, OkrProjects, KeyResults, ColumnsKeyResults, Tasks, Users, TaskAssignees, TaskTags]),
  ],
  controllers: [FilesController],
  providers: [FilesService, OkrProjectsService, ObjectivesService, KeyResultsService, TasksService, ColumnsKeyResultService, TaskTagsService, TaskAssigneesService],
  exports: [FilesService],
})
export class FilesModule {}