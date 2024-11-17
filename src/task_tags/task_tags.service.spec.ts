import { Test, TestingModule } from '@nestjs/testing';
import { TaskTagsService } from './task_tags.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskTag } from './entities/task_tag.entity';
import { Repository } from 'typeorm';
import { CreateTaskTagDto } from './dto/create-task_tag.dto';
import { Tag } from '../tags/entities/tag.entity';
import { Task } from '../tasks/entities/task.entity';
import { UpdateTaskTagDto } from './dto/update-task_tag.dto';

describe('TaskTagsService', () => {
  let service: TaskTagsService;
  let repository: Repository<TaskTag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskTagsService,
        {
          provide: getRepositoryToken(TaskTag),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TaskTagsService>(TaskTagsService);
    repository = module.get<Repository<TaskTag>>(getRepositoryToken(TaskTag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task tag', async () => {
      const createTaskTagDto: CreateTaskTagDto = { task_id: 1, tag_id: 1 };
      const mockTaskTag: TaskTag = {
        ...createTaskTagDto,
        task: new Task(),
        tag: new Tag(),
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(repository, 'create').mockReturnValue(mockTaskTag);
      jest.spyOn(repository, 'save').mockResolvedValue(mockTaskTag);

      const result = await service.create(createTaskTagDto);

      expect(repository.create).toHaveBeenCalledWith(createTaskTagDto);
      expect(repository.save).toHaveBeenCalledWith(mockTaskTag);
      expect(result).toEqual(mockTaskTag);
    });

    it('should throw an error if task_id is not provided', async () => {
      const createTaskTagDto: CreateTaskTagDto = { tag_id: 1, task_id: null };

      jest.spyOn(repository, 'create').mockReturnValue({} as TaskTag);
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('task_id is required'));

      await expect(service.create(createTaskTagDto)).rejects.toThrow(
        'task_id is required',
      );
    });
  });

  describe('findAll', () => {
    it('should find all task tags by task_id', async () => {
      const taskId = 1;
      const mockTaskTags: TaskTag[] = [
        {
          task_id: 1,
          tag_id: 1,
          task: new Task(),
          tag: new Tag(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          task_id: 1,
          tag_id: 2,
          task: new Task(),
          tag: new Tag(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockTaskTags);

      const result = await service.findAll(taskId);
      expect(repository.find).toHaveBeenCalledWith({
        where: { task_id: taskId },
      });
      expect(result).toEqual(mockTaskTags);
    });

    it('should throw an error if task_id is not provided', async () => {
      const taskId = null;
      const error = new Error('task_id is required');

      jest.spyOn(repository, 'find').mockRejectedValue(error);
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('task_id is required'));

      await expect(service.findAll(taskId)).rejects.toThrow(
        'task_id is required',
      );
    });
  });

  describe('findOne', () => {
    it('should find and return a task tag for a specific task', async () => {
      const taskId = 1;
      const tagId = 1;
      const mockTaskTag: TaskTag = {
        task_id: taskId,
        tag_id: tagId,
        task: new Task(),
        tag: new Tag(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTaskTag);

      const result = await service.findOne(taskId, tagId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { task_id: taskId, tag_id: tagId },
      });
      expect(result).toEqual(mockTaskTag);
    });

    it('should throw an error if task_id or tag_id is not provided', async () => {
      const taskId = null;
      const tagId = null;
      const error = new Error('task_id and tag_id are required');
      jest.spyOn(repository, 'findOne').mockRejectedValue(error);

      await expect(service.findOne(taskId, tagId)).rejects.toThrow(
        'task_id and tag_id are required',
      );
    });
  });

  describe('update', () => {
    it('should update a task tag', async () => {
      const taskId = 1;
      const tagId = 1;
      const updateTaskTagDto: UpdateTaskTagDto = { task_id: 1, tag_id: 1 };
      const mockTaskTag: TaskTag = {
        task_id: taskId,
        tag_id: tagId,
        task: new Task(),
        tag: new Tag(),
        created_at: new Date(),
        updated_at: new Date(),
        ...updateTaskTagDto,
      };
      jest.spyOn(repository, 'preload').mockResolvedValue(mockTaskTag);
      jest.spyOn(repository, 'save').mockResolvedValue(mockTaskTag);

      const result = await service.update(taskId, tagId, updateTaskTagDto);

      expect(repository.preload).toHaveBeenCalledWith({
        task_id: taskId,
        tag_id: tagId,
        ...updateTaskTagDto,
      });
      expect(repository.save).toHaveBeenCalledWith(mockTaskTag);
      expect(result).toEqual(mockTaskTag);
    });

    it('should throw an error if task_id or tag_id is not provided', async () => {
      const taskId = null;
      const tagId = null;
      const updateTaskTagDto: UpdateTaskTagDto = { task_id: 1, tag_id: 1 };
      const error = new Error('task_id and tag_id are required');
      jest.spyOn(repository, 'preload').mockRejectedValue(error);
      jest.spyOn(repository, 'save').mockRejectedValue(error);
      await expect(
        service.update(taskId, tagId, updateTaskTagDto),
      ).rejects.toThrow('task_id and tag_id are required');
    });
  });

  describe('remove', () => {
    it('should remove a task tag', async () => {
      const taskId = 1;
      const tagId = 1;
      const mockTaskTag: TaskTag = {
        task_id: taskId,
        tag_id: tagId,
        task: new Task(),
        tag: new Tag(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTaskTag);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockTaskTag);

      const result = await service.remove(taskId, tagId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { task_id: taskId, tag_id: tagId },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockTaskTag);
      expect(result).toEqual(mockTaskTag);
    });

    it('should throw an error if task_id or tag_id is not provided', async () => {
      const taskId = null;
      const tagId = null;
      const error = new Error('task_id and tag_id are required');

      jest.spyOn(repository, 'findOne').mockRejectedValue(error);
      jest.spyOn(repository, 'remove').mockRejectedValue(error);

      await expect(service.remove(taskId, tagId)).rejects.toThrow(
        'task_id and tag_id are required',
      );
    }); 
  });
});
