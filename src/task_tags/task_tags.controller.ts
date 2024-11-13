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

  @Get()
  findAll() {
    return this.taskTagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskTagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskTagDto: UpdateTaskTagDto) {
    return this.taskTagsService.update(+id, updateTaskTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskTagsService.remove(+id);
  }
}
