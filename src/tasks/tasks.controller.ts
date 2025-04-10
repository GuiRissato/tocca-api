import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam, 
  ApiBody,
  getSchemaPath
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tasks } from './entities/task.entity';
import { JwtAuthGuard } from '../users/strategies/jwt-auth.guard';

@ApiTags('tasks')
@Controller('tasks')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  @ApiBody({ 
    type: CreateTaskDto,
    description: 'Dados para criação da tarefa'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Tarefa criada com sucesso.',
    type: Tasks
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos.' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Não autorizado.' 
  })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get('key-result/:keyResultId')
  @ApiOperation({ 
    summary: 'Obter todas as tarefas de um resultado-chave',
    description: 'Retorna todas as tarefas associadas a um resultado-chave específico identificado pelo seu ID.'
  })
  @ApiParam({ 
    name: 'keyResultId', 
    description: 'ID do resultado-chave', 
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de tarefas retornada com sucesso.',
    type: [Tasks]
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Não autorizado.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Resultado-chave não encontrado.' 
  })
  findAll(@Param('keyResultId') keyResultId: number) {
    return this.tasksService.findAll(keyResultId);
  }

  @Get('kanban/:taskId')
  @ApiOperation({ 
    summary: 'Obter todas as tarefas para visualização Kanban',
    description: 'Retorna todas as tarefas organizadas em formato adequado para visualização em quadro Kanban.'
  })
  @ApiParam({ 
    name: 'taskId', 
    description: 'ID da tarefa de referência', 
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de tarefas para Kanban retornada com sucesso.',
    schema: {
      type: 'object',
      properties: {
        columns: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              title: { type: 'string', example: 'To Do' },
              tasks: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(Tasks)
                }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Não autorizado.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Tarefa não encontrada.' 
  })
  findAllKanban(@Param('taskId') taskId: number) {
    return this.tasksService.findAllKanban(taskId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obter uma tarefa pelo ID',
    description: 'Retorna os detalhes de uma tarefa específica identificada pelo seu ID.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da tarefa', 
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Tarefa encontrada.',
    type: Tasks
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Tarefa não encontrada.' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Não autorizado.' 
  })
  findOne(@Param('id') id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar uma tarefa',
    description: 'Atualiza os dados de uma tarefa existente identificada pelo seu ID.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da tarefa', 
    type: 'number',
    example: 1
  })
  @ApiBody({ 
    type: UpdateTaskDto,
    description: 'Dados para atualização da tarefa'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Tarefa atualizada com sucesso.',
    type: Tasks
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Tarefa não encontrada.' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos.' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Não autorizado.' 
  })
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Remover uma tarefa',
    description: 'Remove permanentemente uma tarefa existente identificada pelo seu ID.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da tarefa', 
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Tarefa removida com sucesso.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Tarefa não encontrada.' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Não autorizado.' 
  })
  remove(@Param('id') id: number) {
    return this.tasksService.remove(id);
  }
}
