import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

const mockCommentsService = {
  create: jest.fn(),
   findAll: jest.fn(),
   findOne: jest.fn(),
   update: jest.fn(),
   remove: jest.fn(),
};

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [{
        provide: CommentsService,
         useValue: mockCommentsService,
      }],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      const createCommentDto: CreateCommentDto = {
        task_id: 1,
        user_id: 1,
        commet_text: 'New comment text',
      };
      const createdComment: Comment = {
        task_id: 1,
        task: new Task(),
        user_id: 1,
        user: new User(),
        commet_text: 'New comment text',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdComment);

      const result = await controller.create(createCommentDto);

      expect(result).toEqual(createdComment);
    });

    it('should handle errors when creating a comment', async () => {
      const createCommentDto: CreateCommentDto = {
        task_id: 1,
        user_id: 1,
        commet_text: 'New comment text',
      };
      const errorMessage = 'Error creating comment';

      jest.spyOn(service, 'create').mockRejectedValue(new Error(errorMessage));

      await expect(controller.create(createCommentDto)).rejects.toThrow(errorMessage);
    });
  });

  describe('findOne', () => {
    it('should find a specific comment', async () => {
      const taskId = 1;
      const userId = 1;
      const comment: Comment = {
        task_id: 0,
        task: new Task(),
        user_id: 0,
        user: new User(),
        commet_text: '',
        created_at: undefined,
        updated_at: undefined
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(comment);

      const result = await controller.findOne(taskId, userId);

      expect(result).toEqual(comment);
    });

    it('should throw NotFoundException when comment is not found', async () => {
      const taskId = 1;
      const userId = 1;

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Comment not found'));

      await expect(controller.findOne(taskId, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const taskId = 1;
      const userId = 1;
      const updateCommentDto: UpdateCommentDto = {
        commet_text: 'comentario 2'
      };
      const updatedComment: Comment = {
        task_id: 0,
        task: new Task(),
        user_id: 0,
        user: new User(),
        commet_text: '',
        created_at: undefined,
        updated_at: undefined
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedComment);

      const result = await controller.update(taskId, userId, updateCommentDto);

      expect(result).toEqual(updatedComment);
    });

    it('should throw NotFoundException when comment is not found for update', async () => {
      const taskId = 1;
      const userId = 1;
      const updateCommentDto: UpdateCommentDto = {
        // Define the fields to update in the comment
      };

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException('Comment not found'));

      await expect(controller.update(taskId, userId, updateCommentDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a comment', async () => {
      const taskId = 1;
      const userId = 1;
      const removedComment: Comment = {
        task_id: 0,
        task: new Task,
        user_id: 0,
        user: new User,
        commet_text: '',
        created_at: undefined,
        updated_at: undefined
      };

      jest.spyOn(service, 'remove').mockResolvedValue(removedComment);

      const result = await controller.remove(taskId, userId);

      expect(result).toEqual(removedComment);
    });

    it('should throw NotFoundException when comment is not found for removal', async () => {
      const taskId = 1;
      const userId = 1;

      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException('Comment not found'));

      await expect(controller.remove(taskId, userId)).rejects.toThrow(NotFoundException);
    });
  });
});
