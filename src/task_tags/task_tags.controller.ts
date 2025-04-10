import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskTagsService } from './task_tags.service';
import { CreateTaskTagDto } from './dto/create-task_tag.dto';
import { UpdateTaskTagDto } from './dto/update-task_tag.dto';

@Controller('task-tags')
export class TaskTagsController {
  constructor(private readonly taskTagsService: TaskTagsService) {}

  @Post()
  create(@Body() createTaskTagDto: CreateTaskTagDto) {
    return this.taskTagsService.create(createTaskTagDto);
  }

  @Get(':taskId')
  findAll(@Param('taskId') taskId: number) {
    return this.taskTagsService.findAll(taskId);
  }

  @Get(':taskId/:tagId')
  findOne( taskId: number, tagId: number) {
    return this.taskTagsService.findOne(taskId, tagId);
  }

  @Patch('taskId/:tagId')
  update( taskId: number, tagId: number, updateTaskTagDto: UpdateTaskTagDto) {
    return this.taskTagsService.update(taskId, tagId, updateTaskTagDto);
  }

  @Delete(':taskId/:tagId') 
  remove(@Param('taskId') taskId: number, @Param('tagId') tagId: number) {
    return this.taskTagsService.remove(taskId, tagId);
  }
  
}
