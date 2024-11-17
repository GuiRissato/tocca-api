import { Module } from '@nestjs/common';
import { TaskTagsService } from './task_tags.service';
import { TaskTagsController } from './task_tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskTag } from './entities/task_tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskTag])],
  controllers: [TaskTagsController],
  providers: [TaskTagsService],
})
export class TaskTagsModule {}
