import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskAssigneeDto } from './dto/create-task_assignee.dto';
import { UpdateTaskAssigneeDto } from './dto/update-task_assignee.dto';
import { TaskAssignees } from './entities/task_assignee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskAssigneesService {
  constructor(
    @InjectRepository(TaskAssignees)
    private readonly repository: Repository<TaskAssignees>,
  ) {}

  create(createTaskAssigneeDto: CreateTaskAssigneeDto): Promise<TaskAssignees> {
    try {
      const taskAssignee = this.repository.create(createTaskAssigneeDto);
      return this.repository.save(taskAssignee);
    } catch (error) {
      console.error('Error creating task assignee', error.message);
      throw new Error('Error creating task assignee ' + error.message);
    }
  }

  findAll(taskId: number): Promise<TaskAssignees[]> {
    try {
      const taskAssignees = this.repository.find({ where: { task_id: taskId}});
      return taskAssignees;
    } catch (error) {
      console.error('Error retrieving task assignees', error.message);
      throw new Error('Error retrieving task assignees ' + error.message);
    }
  }

  async findOne(taskId: number, userId: number): Promise<TaskAssignees> {
    try {
      const taskAssignee = await this.repository.findOne({ where: { task_id: taskId, user_id: userId } });
      if (!taskAssignee) {
        throw new NotFoundException(`Task assignee with id ${taskId} - ${userId} not found`);
      }
      return taskAssignee;
    } catch (error) {
      console.error('Error finding task assignee', error.message);
      throw new NotFoundException('Error finding task assignee ' + error.message);
    }
  }

  async findUserInfo(userId: number): Promise<any> {
    try {
      // Usando uma consulta personalizada para buscar informações do usuário
      const userInfo = await this.repository.query(`
        SELECT u.id, u.username, u.email
        FROM users u
        WHERE u.id = $1
      `, [userId]);
      
      if (!userInfo || userInfo.length === 0) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      
      return userInfo[0];
    } catch (error) {
      console.error('Error finding user info', error.message);
      throw new NotFoundException('Error finding user info: ' + error.message);
    }
  }

  async update(taskId: number, userId: number, updateTaskAssigneeDto: UpdateTaskAssigneeDto): Promise<TaskAssignees> {
    try {
      const taskAssignee = await this.repository.preload({
        task_id: taskId,
        user_id: userId,
        ...updateTaskAssigneeDto,
      });

      if (!taskAssignee) {
        throw new NotFoundException(`Task assignee with task_id ${taskId} and user_id ${userId} not found`);
      }

      return this.repository.save(taskAssignee);
    } catch (error) {
      console.error('Error updating task assignee', error.message);
      throw new NotFoundException('Error updating task assignee ' + error.message);
    }
  }

  async remove(taskId: number, userId: number) {
    try {
      const taskAssignee = await this.repository.findOne({ where: { task_id: taskId, user_id: userId } });
      if (!taskAssignee) {
        throw new NotFoundException(`Task assignee with task_id ${taskId} and user_id ${userId} not found`);
      }
      return this.repository.remove(taskAssignee);
    } catch (error) {
      console.error('Error deleting task assignee', error.message);
      throw new Error ('Error deleting task assignee ' + error.message);
    }
  }
}