import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { TaskTagsService } from './task_tags.service';
import { CreateTaskTagDto } from './dto/create-task_tag.dto';
import { UpdateTaskTagDto } from './dto/update-task_tag.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { TaskTags } from './entities/task_tag.entity';
import { JwtAuthGuard } from '../users/strategies/jwt-auth.guard';

@ApiTags('task-tags')
@Controller('task-tags')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class TaskTagsController {
  constructor(private readonly taskTagsService: TaskTagsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova associação entre tarefa e tag' })
  @ApiBody({ type: CreateTaskTagDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Associação criada com sucesso.',
    type: TaskTags
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos.' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Associação já existe.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Tarefa ou tag não encontrada.' 
  })
  create(@Body() createTaskTagDto: CreateTaskTagDto) {
    return this.taskTagsService.create(createTaskTagDto);
  }

  @Get(':taskId')
  @ApiOperation({ summary: 'Obter todas as tags associadas a uma tarefa' })
  @ApiParam({ 
    name: 'taskId', 
    description: 'ID da tarefa', 
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de associações retornada com sucesso.',
    type: [TaskTags]
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Tarefa não encontrada.' 
  })
  findAll(@Param('taskId') taskId: number) {
    return this.taskTagsService.findAll(taskId);
  }

  @Get(':taskId/:tagId')
  @ApiOperation({ summary: 'Obter uma associação específica entre tarefa e tag' })
  @ApiParam({ 
    name: 'taskId', 
    description: 'ID da tarefa', 
    type: 'number',
    example: 1
  })
  @ApiParam({ 
    name: 'tagId', 
    description: 'ID da tag', 
    type: 'number',
    example: 2
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Associação encontrada.',
    type: TaskTags
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Associação não encontrada.' 
  })
  findOne(
    @Param('taskId') taskId: number, 
    @Param('tagId') tagId: number
  ) {
    return this.taskTagsService.findOne(taskId, tagId);
  }

  @Patch(':taskId/:tagId')
  @ApiOperation({ summary: 'Atualizar uma associação entre tarefa e tag' })
  @ApiParam({ 
    name: 'taskId', 
    description: 'ID da tarefa', 
    type: 'number',
    example: 1
  })
  @ApiParam({ 
    name: 'tagId', 
    description: 'ID da tag', 
    type: 'number',
    example: 2
  })
  @ApiBody({ type: UpdateTaskTagDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Associação atualizada com sucesso.',
    type: TaskTags
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Associação não encontrada.' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos.' 
  })
  update(
    @Param('taskId') taskId: number, 
    @Param('tagId') tagId: number, 
    @Body() updateTaskTagDto: UpdateTaskTagDto
  ) {
    return this.taskTagsService.update(taskId, tagId, updateTaskTagDto);
  }

  @Delete(':taskId/:tagId')
  @ApiOperation({ summary: 'Remover uma associação entre tarefa e tag' })
  @ApiParam({ 
    name: 'taskId', 
    description: 'ID da tarefa', 
    type: 'number',
    example: 1
  })
  @ApiParam({ 
    name: 'tagId', 
    description: 'ID da tag', 
    type: 'number',
    example: 2
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Associação removida com sucesso.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Associação não encontrada.' 
  })
  remove(
    @Param('taskId') taskId: number, 
    @Param('tagId') tagId: number
  ) {
    return this.taskTagsService.remove(taskId, tagId);
  }
}
