import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskAssigneesService } from './task_assignees.service';
import { CreateTaskAssigneeDto } from './dto/create-task_assignee.dto';
import { UpdateTaskAssigneeDto } from './dto/update-task_assignee.dto';

@Controller('task-assingees')
export class TaskAssigneesController {
  constructor(private readonly taskAssigneesService: TaskAssigneesService) {}

  @Post()
  create(@Body() createTaskAssigneeDto: CreateTaskAssigneeDto) {
    return this.taskAssigneesService.create(createTaskAssigneeDto);
  }

  @Get(':taskId')
  findAll(@Param('taskId') taskId: number) {
    return this.taskAssigneesService.findAll(taskId);
  }

  @Get(':taskId/:userId')
  findOne(@Param('taskId') taskId: number, @Param('userId') userId: number) {
    return this.taskAssigneesService.findOne(taskId, userId);
  }

  @Patch(':taskId/:userId')
  update(@Param('taskId') taskId: number, @Param('userId') userId: number, @Body() updateTaskAssigneeDto: UpdateTaskAssigneeDto) {
    return this.taskAssigneesService.update(taskId, userId, updateTaskAssigneeDto);
  }

  @Delete(':taskId/:userId')
  remove(@Param('taskId') taskId: number, @Param('userId') userId: number) {
    return this.taskAssigneesService.remove(taskId, userId);
  }
}
