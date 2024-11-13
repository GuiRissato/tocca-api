import { Module } from '@nestjs/common';
import { TaskTagsService } from './task_tags.service';
import { TaskTagsController } from './task_tags.controller';

@Module({
  controllers: [TaskTagsController],
  providers: [TaskTagsService],
})
export class TaskTagsModule {}
