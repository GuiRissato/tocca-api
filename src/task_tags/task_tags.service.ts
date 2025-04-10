import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskTagDto } from './dto/create-task_tag.dto';
import { UpdateTaskTagDto } from './dto/update-task_tag.dto';
import { TaskTags } from './entities/task_tag.entity';

@Injectable()
export class TaskTagsService {
  constructor(
     @InjectRepository(TaskTags)
     private readonly repository: Repository<TaskTags>,
   ) {}

  create(createTaskTagDto: CreateTaskTagDto): Promise<TaskTags> {
    try {
      const taskTag = this.repository.create(createTaskTagDto);
      return this.repository.save(taskTag);
    } catch (error) {
      console.error( 'Error creating task tag', error.message );
      throw new Error( 'Error creating task tag ' + error.message );
    }
  }

  findAll(taskId: number): Promise<TaskTags[]> {
    try {
      const taskTags = this.repository.find({ where: { task_id: taskId } });
      return taskTags;
    } catch (error) {
      console.error( 'Error retrieving task tags', error.message);
      throw new Error( 'Error retrieving task tags' + error.message);
    }
  }

  async findOne(taskId: number, tagId: number): Promise<TaskTags> {
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

  async findTagInfo(tagId: number): Promise<any> {
    try {
      // Usando uma consulta personalizada para buscar informações da tag
      const tagInfo = await this.repository.query(`
        SELECT t.id, t.tag_name
        FROM tags t
        WHERE t.id = $1
      `, [tagId]);
      
      if (!tagInfo || tagInfo.length === 0) {
        throw new NotFoundException(`Tag with id ${tagId} not found`);
      }
      
      return tagInfo[0];
    } catch (error) {
      console.error('Error finding tag info', error.message);
      throw new NotFoundException('Error finding tag info: ' + error.message);
    }
  }

  async update(taskId: number, tagId: number, updateTaskTagDto: UpdateTaskTagDto): Promise<TaskTags> {
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
        return  this.repository.remove(taskTag);
     } catch (error) {
       console.error( 'Error removing task tag', error.message );
       throw new Error( 'Error removing task tag ' + error.message );
     }
   }
  }