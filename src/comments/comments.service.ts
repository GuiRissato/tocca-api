import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
  ) {}

  create(createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const comment = this.repository.create(createCommentDto);
      return this.repository.save(comment);
    } catch (error) {
      console.error('Error creating comment', error.message);
      throw new Error('Error creating comment ' + error.message);
    }
  }

  findAll(taskId: number): Promise<Comment[]> {
    try {
      const comments = this.repository.find({ where: { task_id: taskId}});
      return comments;
    } catch (error) {
      console.error( 'Error retrieving comments', error.message);
      throw new Error('Error retrieving comments');
    }
  }

  async findOne(taskId: number, userId: number): Promise<Comment> {
    try {
      const comment = await this.repository.findOne({ where: { task_id: taskId, user_id: userId } });
      if (!comment) {
        throw new NotFoundException(`Comment with id ${taskId} - ${userId} not found`);
      }
      return comment;
    } catch (error) {
      console.error('Error finding comment', error.message);
      throw new NotFoundException('Error finding comment ' + error.message);
    }
  }

  async update(taskId: number, userId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    try {
      const comment = await this.repository.preload({
        task_id: taskId,
        user_id: userId,
        ...updateCommentDto,
      });
      if (!comment) {
        throw new NotFoundException(`Comment with id ${taskId} - ${userId} not found`);
      }
      return this.repository.save(comment);
    } catch (error) {
      console.error('Error updating comment', error.message);
       throw new NotFoundException('Error updating comment ' + error.message);
    }
  }

  async remove(taskId: number, userId: number): Promise<Comment> {
    try {
      const comment = await this.repository.findOne({ where: { task_id: taskId, user_id: userId } });
      if (!comment) {
        throw new NotFoundException(`Comment with id ${taskId} - ${userId} not found`);
      }
      return this.repository.remove(comment);
    } catch (error) {
      console.error('Error removing comment', error.message);
      throw new NotFoundException('Error removing comment ' + error.message);
    }
  }
}