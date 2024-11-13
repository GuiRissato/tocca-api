import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskTagDto } from './dto/create-task_tag.dto';
import { UpdateTaskTagDto } from './dto/update-task_tag.dto';
import { TaskTag } from './entities/task_tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskTagsService {
  constructor(
     @InjectRepository(TaskTag)
     private readonly repository: Repository<TaskTag>,
   ) {}

  create(createTaskTagDto: CreateTaskTagDto): Promise<TaskTag> {
    try {
      const taskTag = this.repository.create(createTaskTagDto);
      return this.repository.save(taskTag);
    } catch (error) {
      console.error( 'Error creating task tag', error.message );
      throw new Error( 'Error creating task tag ' + error.message );
    }
  }

  findAll(taskId: number): Promise<TaskTag[]> {
    try {
      const taskTags = this.repository.find({ where: { task_id: taskId } });
      return taskTags;
    } catch (error) {
      console.error( 'Error retrieving task tags', error.message);
      throw new Error( 'Error retrieving task tags' + error.message);
    }
  }

  async findOne(taskId: number, tagId: number): Promise<TaskTag> {
    try {
      const taskTag = await this.repository.findOne({ where: { task_id: taskId, tag_id: tagId } });
      if (!taskTag) {
        throw new NotFoundException(`Task tag with id ${taskId} - ${tagId} not found`);
      }
      return taskTag;
    } catch (error) {
      console.error( 'Error finding task tag', error.message );
      throw new NotFoundException( 'Error finding task tag'  + error.message );
    }
  }

  async update(taskId: number, tagId: number, updateTaskTagDto: UpdateTaskTagDto): Promise<TaskTag> {
    try {
       const taskTag = await this.repository.preload({
         task_id: taskId,
         tag_id: tagId,
         ...updateTaskTagDto
       });
       if (!taskTag) {
         throw new NotFoundException(`Task tag with id ${taskId} - ${tagId} not found`);
       }
       return this.repository.save(taskTag);
     } catch (error) {
       console.error( 'Error updating task tag', error.message );
       throw new Error( 'Error updating task tag ' + error.message );
     }
   }

  async remove(taskId: number, tagId: number) {
    try {
       const taskTag = await this.repository.findOne({ where: { task_id: taskId, tag_id: tagId } });
       if (!taskTag) {
         throw new NotFoundException(`Task tag with id ${taskId} - ${tagId} not found`);
       }
       this.repository.delete(taskTag);
     } catch (error) {
       console.error( 'Error removing task tag', error.message );
       throw new Error( 'Error removing task tag ' + error.message );
     }
   }
  }
