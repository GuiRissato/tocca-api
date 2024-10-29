import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = this.repository.create(createTaskDto);
      return this.repository.save(task);
    } catch (error) {
      console.error('Error creating task', error.message);
      throw 'Error creating task' + error.message;
    }
  }

  findAll(key_result_id: number): Promise<Task[]> {
  try {
    const tasks = this.repository.find({ where: { key_result_id } });
    return tasks;
  } catch (error) {
    console.error('Error retrieving tasks for key_result_id', error.message);
    throw new Error('Error retrieving tasks for key_result_id');
  }
}
  findOne(id: number): Promise<Task> {
    try {
      const task = this.repository.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException(`Task with id ${id} not found`);
      }
      return task;
    } catch (error) {
      console.error('Error finding task', error.message);
      throw new NotFoundException('Error finding task');
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
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