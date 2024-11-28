import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { Objectives } from '../objectives/entities/objective.entity';
import { OkrProjects } from '../okr_projects/entities/okr_project.entity';
import { KeyResults } from '../key_results/entities/key_result.entity';
import { Users } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Objectives, OkrProjects, KeyResults, Users]),
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}