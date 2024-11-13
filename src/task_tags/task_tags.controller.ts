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

  @Get(':tasId/:tagId')
  findOne( tasId: number, tagId: number) {
    return this.taskTagsService.findOne(tasId, tagId);
  }

  @Patch('tasId/:tagId')
  update( tasId: number, tagId: number, updateTaskTagDto: UpdateTaskTagDto) {
    return this.taskTagsService.update(tasId, tagId, updateTaskTagDto);
  }

  @Delete(':tasId/:tagId') 
  remove(@Param('tasId') tasId: number, @Param('tagId') tagId: number) {
    return this.taskTagsService.remove(tasId, tagId);
  }
  
}
