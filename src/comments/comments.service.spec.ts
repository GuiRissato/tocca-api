import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

describe('CommentsService', () => {
  let service: CommentsService;
  let repository: Repository<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const createCommentDto: CreateCommentDto = {
        task_id: 1,
        user_id: 1,
        commet_text: 'comentario 1'
      };
      const mockComment: Comment = {
        task_id: 0,
        task: new Task(),
        user_id: 0,
        user: new User(),
        commet_text: '',
        created_at: undefined,
        updated_at: undefined
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockComment);
      jest.spyOn(repository, 'save').mockResolvedValue(mockComment);

      const result = await service.create(createCommentDto);

      expect(repository.create).toHaveBeenCalledWith(createCommentDto);
      expect(repository.save).toHaveBeenCalledWith(mockComment);
      expect(result).toEqual(mockComment);
    });

    it('should throw an error when creating a comment fails', async () => {
      const createCommentDto: CreateCommentDto = {
        task_id: 0,
        user_id: 0,
        commet_text: ''
      };
      const error = new Error('Database connection error');

      jest.spyOn(repository, 'create').mockReturnValue({} as Comment);
      jest.spyOn(repository, 'save').mockRejectedValue(error);

      await expect(service.create(createCommentDto)).rejects.toThrow('Database connection error');
    });
  });

  describe('findAll', () => {
    it('should find and return all comments for a specific task', async () => {
      const taskId = 1;
      const mockComments: Comment[] = [
        { task_id: taskId, user_id: 1, task: new Task(), user: new User(), commet_text: 'Comment 1', created_at: new Date(), updated_at: new Date() },
        { task_id: taskId, user_id: 2, task: new Task(), user: new User(), commet_text: 'Comment 2', created_at: new Date(), updated_at: new Date() }
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockComments);

      const result = await service.findAll(taskId);

      expect(repository.find).toHaveBeenCalledWith({ where: { task_id: taskId } });
      expect(result).toEqual(mockComments);
    });

    it('should throw an error when retrieving comments fails', async () => {
      const taskId = 1;
      const error = new Error('Database connection error');

      jest.spyOn(repository, 'find').mockRejectedValue(error);

      await expect(service.findAll(taskId)).rejects.toThrow('Database connection error');
    });
  });

  describe('findOne', () => {
    it('should find and return a specific comment for a task and user', async () => {
      const taskId = 1;
      const userId = 1;
      const mockComment: Comment = {
        task_id: taskId,
        user_id: userId,
        task: new Task(),
        user: new User(),
        commet_text: 'Comment 1',
        created_at: new Date(),
        updated_at: new Date()
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockComment);

      const result = await service.findOne(taskId, userId);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { task_id: taskId, user_id: userId } });
      expect(result).toEqual(mockComment);
    });

    it('should throw an error when the specific comment is not found', async () => {
      const taskId = 1;
      const userId = 1;
      const error = new NotFoundException(`Comment with id ${taskId} - ${userId} not found`);

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(taskId, userId)).rejects.toThrow('Error finding comment ' + error.message);
    });

    it('should throw an error when finding a comment fails', async () => {
      const taskId = 1;
      const userId = 1;
      const error = new Error('Database connection error');

      jest.spyOn(repository, 'findOne').mockRejectedValue(error);

      await expect(service.findOne(taskId, userId)).rejects.toThrow('Database connection error');
    });
  });

  describe('update', () => {
    it('should update a specific comment for a task and user', async () => {
      const taskId = 1;
      const userId = 1;
      const updateCommentDto: UpdateCommentDto = {
        commet_text: 'Updated comment'
      };
      const mockComment: Comment = {
        task_id: taskId,
        user_id: userId,
        task: new Task(),
        user: new User(),
        commet_text: 'Comment 1',
        created_at: new Date(),
        updated_at: new Date()
      };

      jest.spyOn(repository, 'preload').mockResolvedValue(mockComment);
      jest.spyOn(repository, 'save').mockResolvedValue(mockComment);

      const result = await service.update(taskId, userId, updateCommentDto);

      expect(repository.preload).toHaveBeenCalledWith({
        task_id: taskId,
        user_id: userId,
        ...updateCommentDto,
      });
      expect(repository.save).toHaveBeenCalledWith(mockComment);
      expect(result).toEqual(mockComment);
    });

    it('should throw an error when the specific comment is not found for updating', async () => {
      const taskId = 1;
      const userId = 1;
      const updateCommentDto: UpdateCommentDto = {
        commet_text: 'Updated comment'
      };
      const error = new NotFoundException(`Comment with id ${taskId} - ${userId} not found`);

      jest.spyOn(repository, 'preload').mockResolvedValue(undefined);

      await expect(service.update(taskId, userId, updateCommentDto)).rejects.toThrow('Error updating comment ' + error.message);
    });

    it('should throw an error when updating a comment fails', async () => {
      const taskId = 1;
      const userId = 1;
      const updateCommentDto: UpdateCommentDto = {
        commet_text: 'Updated comment'
      };
      const error = new Error('Database connection error');

      jest.spyOn(repository, 'preload').mockRejectedValue(error);

      await expect(service.update(taskId, userId, updateCommentDto)).rejects.toThrow('Database connection error');
    });
  });

  describe('remove', () => {
    it('should remove a specific comment for a task and user', async () => {
      const taskId = 1;
      const userId = 1;
      const mockComment: Comment = {
        task_id: taskId,
        user_id: userId,
        task: new Task(),
        user: new User(),
        commet_text: 'Comment 1',
        created_at: new Date(),
        updated_at: new Date()
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockComment);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockComment);

      const result = await service.remove(taskId, userId);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { task_id: taskId, user_id: userId } });
      expect(repository.remove).toHaveBeenCalledWith(mockComment);
      expect(result).toEqual(mockComment);
    });

    it('should throw an error when the specific comment is not found for removal', async () => {
      const taskId = 1;
      const userId = 1;
      const error = new NotFoundException(`Comment with id ${taskId} - ${userId} not found`);

      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.remove(taskId, userId)).rejects.toThrow('Error removing comment ' + error.message);
    });

    it('should throw an error when removing a comment fails', async () => {
      const taskId = 1;
      const userId = 1;
      const error = new Error('Database connection error');

      jest.spyOn(repository, 'findOne').mockRejectedValue(error);

      await expect(service.remove(taskId, userId)).rejects.toThrow('Error removing comment Database connection error');
    });
  });
});