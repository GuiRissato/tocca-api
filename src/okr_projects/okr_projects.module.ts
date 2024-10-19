import { Module } from '@nestjs/common';
import { OkrProjectsService } from './okr_projects.service';
import { OkrProjectsController } from './okr_projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OkrProject } from './entities/okr_project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OkrProject])],
  controllers: [OkrProjectsController],
  providers: [OkrProjectsService],
})
export class OkrProjectsModule {}
