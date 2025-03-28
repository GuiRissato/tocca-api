import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tasks } from './entities/task.entity';
import { ColumnsKeyResultService } from 'src/columns_key_result/columns_key_result.service';
import { KeyResults } from '../key_results/entities/key_result.entity';
import { ColumnsKeyResults } from '../columns_key_result/entities/columns_key_result.entity';
import { TaskTagsService } from '../task_tags/task_tags.service';
import { TaskAssigneesService } from '../task_assingees/task_assignees.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private readonly repository: Repository<Tasks>,
    @InjectRepository(KeyResults)
    private readonly keyResultsRepository: Repository<KeyResults>,
    private readonly columnsKeyResultService: ColumnsKeyResultService,
    private readonly taskTagsService: TaskTagsService,
    private readonly taskAssigneesService: TaskAssigneesService
  ) {}

  create(createTaskDto: CreateTaskDto): Promise<Tasks> {
    try {
      const task = this.repository.create(createTaskDto);
      return this.repository.save(task);
    } catch (error) {
      console.error('Error creating task', error.message);
      throw 'Error creating task' + error.message;
    }
  }

  findAll(key_result_id: number): Promise<Tasks[]> {
    try {
      const tasks = this.repository.find({ where: { key_result_id } });
      return tasks;
    } catch (error) {
      console.error('Error retrieving tasks for key_result_id', error.message);
      throw new Error('Error retrieving tasks for key_result_id');
    }
  }

  async findAllKanban(key_result_id: number): Promise<any> {
    try {
      // Buscar o key result para obter seu nome
      const keyResult = await this.keyResultsRepository.findOne({
        where: { id: key_result_id }
      });

      if (!keyResult) {
        throw new NotFoundException(`Key Result with id ${key_result_id} not found`);
      }

      // Buscar todas as colunas relacionadas a este key_result_id
      const columnsKeyResult = await this.columnsKeyResultService.findAll(key_result_id);
      
      // Buscar todas as tarefas relacionadas a este key_result_id
      const tasks = await this.repository.find({
        where: { key_result_id }
      });
      
      // Para cada tarefa, buscar suas tags e assignees com informações completas
      const enhancedTasks = await Promise.all(tasks.map(async (task) => {
        // Buscar tags da tarefa com informações completas
        const taskTags = await this.taskTagsService.findAll(task.id);
        
        // Buscar informações completas das tags usando uma consulta personalizada
        const tags = await Promise.all(taskTags.map(async (taskTag) => {
          // Aqui assumimos que você tem um método para buscar informações da tag pelo ID
          // ou podemos usar uma consulta personalizada
          const tagInfo = await this.taskTagsService.findTagInfo(taskTag.tag_id);
          return {
            ...taskTag,
            tag_name: tagInfo.tag_name,
            color: tagInfo.color
          };
        }));
        
        // Buscar assignees da tarefa com informações completas
        const taskAssignees = await this.taskAssigneesService.findAll(task.id);
        
        // Buscar informações completas dos usuários
        const assignees = await Promise.all(taskAssignees.map(async (assignee) => {
          // Aqui assumimos que você tem um método para buscar informações do usuário pelo ID
          // ou podemos usar uma consulta personalizada
          const userInfo = await this.taskAssigneesService.findUserInfo(assignee.user_id);
          return {
            ...assignee,
            user_name: userInfo.name,
            email: userInfo.email,
            avatar: userInfo.avatar
          };
        }));
        
        // Retornar a tarefa com suas tags e assignees completos
        return {
          ...task,
          tags,
          assignees
        };
      }));
      
      // Organizar as tarefas por coluna
      const tasksByColumn = columnsKeyResult.map(column => {
        const tasksInColumn = enhancedTasks.filter(task => 
          task.column_key_result_id === column.id
        );
        
        return {
          column_id: column.id,
          column_name: column.column_name,
          tasks: tasksInColumn
        };
      });

      // Retornar um objeto com todas as informações necessárias
      return {
        key_result_id,
        key_result_name: keyResult.key_result_name,
        columns: tasksByColumn
      };
    } catch (error) {
      console.error('Error retrieving tasks for key_result_id', error.message);
      throw new Error(`Error retrieving tasks for key_result_id: ${error.message}`);
    }
  }

  findOne(id: number): Promise<Tasks> {
    try {
      const task = this.repository.findOne({ 
        where: { id },
        relations: ['columnKeyResultId', 'keyResultId']
      });
      
      if (!task) {
        throw new NotFoundException(`Task with id ${id} not found`);
      }
      return task;
    } catch (error) {
      console.error('Error finding task', error.message);
      throw new NotFoundException('Error finding task');
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Tasks> {
    try {
      const task = await this.repository.preload({
        id: id,
        ...updateTaskDto,
      });

      if (!task) {
        throw new NotFoundException(`Task ${id} not found`);
      }

      return this.repository.save(task);
    } catch (error) {
      console.error('Error updating task', error.message);
      throw new NotFoundException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const task = await this.findOne(id);
      return this.repository.remove(task);
    } catch (error) {
      console.error('Error deleting task', error.message);
      throw 'Error deleting task';
    }
  }
}