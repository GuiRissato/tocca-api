import { Test, TestingModule } from '@nestjs/testing';
import { TaskTagsService } from './task_tags.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskTag } from './entities/task_tag.entity';
import { NotFoundException } from '@nestjs/common';
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
        }

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
        updated_at: new Date()
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
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('task_id is required'));
      
      await expect(service.create(createTaskTagDto)).rejects.toThrow('task_id is required');
    });
  });

  describe('findAll', () => {
    it( 'should find all task tags by task_id', async () => {
      const taskId = 1;
      const mockTaskTags: TaskTag[] = [
        {
          task_id: 1,
          tag_id: 1,
          task: new Task(),
          tag: new Tag(),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          task_id: 1,
          tag_id: 2,
          task: new Task(),
          tag: new Tag(),
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(  mockTaskTags );

      const result = await service.findAll(taskId);
      expect(repository.find).toHaveBeenCalledWith({ where: { task_id: taskId } });
      expect(result).toEqual(mockTaskTags);
    });

    it('should throw an error if task_id is not provided', async () => {
      const taskId = null;
      const error = new Error('task_id is required');

      jest.spyOn(repository, 'find').mockRejectedValue(error);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('task_id is required'));

      await expect(service.findAll(taskId)).rejects.toThrow('task_id is required');
    });

  });

  describe('findOne', () => {
    
  })

})
