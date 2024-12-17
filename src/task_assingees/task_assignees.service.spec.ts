import { Test, TestingModule } from '@nestjs/testing';
import { TaskAssigneesService } from './task_assignees.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskAssignees } from './entities/task_assignee.entity';
import { Repository } from 'typeorm';
import { CreateTaskAssigneeDto } from './dto/create-task_assignee.dto';
import { Users } from '../users/entities/user.entity';
import { Tasks } from '../tasks/entities/task.entity';
import { UpdateTaskAssigneeDto } from './dto/update-task_assignee.dto';

describe('TaskAssigneesService', () => {
  let service: TaskAssigneesService;
  let repository: Repository<TaskAssignees>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskAssigneesService,
        {
          provide: getRepositoryToken(TaskAssignees),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TaskAssigneesService>(TaskAssigneesService);
    repository = module.get<Repository<TaskAssignees>>(
      getRepositoryToken(TaskAssignees),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task assignee', async () => {
      const createTaskAssigneeDto: CreateTaskAssigneeDto = {
        task_id: 1,
        user_id: 1,
      };
      const mockTaskAssignee: TaskAssignees = {
        ...createTaskAssigneeDto,
        task: new Tasks(),
        user: new Users(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockTaskAssignee);
      jest.spyOn(repository, 'save').mockResolvedValue(mockTaskAssignee);

      const result = await service.create(createTaskAssigneeDto);

      expect(repository.create).toHaveBeenCalledWith(createTaskAssigneeDto);
      expect(repository.save).toHaveBeenCalledWith(mockTaskAssignee);
      expect(result).toEqual(mockTaskAssignee);
    });

    it('should throw an error when creating a task assignee fails', async () => {
      const createTaskAssigneeDto: CreateTaskAssigneeDto = {
        task_id: 1,
        user_id: 1,
      };
      const error = new Error('Database connection error');

      jest.spyOn(repository, 'create').mockReturnValue({} as TaskAssignees);
      jest.spyOn(repository, 'save').mockRejectedValue(error);

      await expect(service.create(createTaskAssigneeDto)).rejects.toThrow(
        'Database connection error',
      );
    });
  });

  describe('findAll', () => {
    it('should find and return all task assignees for a specific task', async () => {
      const taskId = 1;
      const mockTaskAssignees: TaskAssignees[] = [
        {
          task_id: taskId,
          user_id: 1,
          task: new Tasks(),
          user: new Users(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          task_id: taskId,
          user_id: 2,
          task: new Tasks(),
          user: new Users(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockTaskAssignees);

      const result = await service.findAll(taskId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { task_id: taskId },
      });
      expect(result).toEqual(mockTaskAssignees);
    });

    it('should throw an error when retrieving task assignees fails', async () => {
      const taskId = 1;
      const error = new Error('Database connection error');

      jest.spyOn(repository, 'find').mockRejectedValue(error);

      await expect(service.findAll(taskId)).rejects.toThrow(
        'Database connection error',
      );
    });
  });

  describe('findOne', () => {
    it('should find and return a task assignee for a specific task and user', async () => {
      const taskId = 1;
      const userId = 1;
      const mockTaskAssignee: TaskAssignees = {
        task_id: taskId,
        user_id: userId,
        task: new Tasks(),
        user: new Users(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTaskAssignee);

      const result = await service.findOne(taskId, userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { task_id: taskId, user_id: userId },
      });
      expect(result).toEqual(mockTaskAssignee);
    });

    it('should throw an error when task assignee is not found', async () => {
      const taskId = 1;
      const userId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(taskId, userId)).rejects.toThrow(
        'Error finding task assignee Task assignee with id 1 - 1 not found',
      );
    });
  });

  describe('update', () => {
    it('should update a task assignee', async () => {
      const taskId = 1;
      const userId = 1;
      const updateTaskAssigneeDto: UpdateTaskAssigneeDto = { user_id: 2 };
      const mockTaskAssignee: TaskAssignees = {
        task_id: taskId,
        user_id: userId,
        task: new Tasks(),
        user: new Users(),
        created_at: new Date(),
        updated_at: new Date(),
        ...updateTaskAssigneeDto,
      };

      jest.spyOn(repository, 'preload').mockResolvedValue(mockTaskAssignee);
      jest.spyOn(repository, 'save').mockResolvedValue(mockTaskAssignee);

      const result = await service.update(
        taskId,
        userId,
        updateTaskAssigneeDto,
      );

      expect(repository.preload).toHaveBeenCalledWith({
        task_id: taskId,
        user_id: userId,
        ...updateTaskAssigneeDto,
      });
      expect(repository.save).toHaveBeenCalledWith(mockTaskAssignee);
      expect(result).toEqual(mockTaskAssignee);
    });

    it('should throw an error when updating a task assignee fails', async () => {
      const taskId = 1;
      const userId = 1;
      const updateTaskAssigneeDto: UpdateTaskAssigneeDto = { task_id: 2 };
      const error = new Error('Database connection error');

      jest.spyOn(repository, 'preload').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockRejectedValue(error);

      await expect(
        service.update(taskId, userId, updateTaskAssigneeDto),
      ).rejects.toThrow('Task assignee with task_id 1 and user_id 1 not found');
    });
  });

  describe('remove', () => {
    it('should remove a task assignee', async () => {
      const taskId = 1;
      const userId = 1;
      const mockTaskAssignee: TaskAssignees = {
        task_id: taskId,
        user_id: userId,
        task: new Tasks(),
        user: new Users(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTaskAssignee);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockTaskAssignee);

      const result = await service.remove(taskId, userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { task_id: taskId, user_id: userId },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockTaskAssignee);
      expect(result).toEqual(mockTaskAssignee);
    });

    it('should throw an error when task assignee is not found for removal', async () => {
      const taskId = 1;
      const userId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(taskId, userId)).rejects.toThrow(
        'Error deleting task assignee Task assignee with task_id 1 and user_id 1 not found',
      );
    });

    it('should throw an error when deleting a task assignee fails', async () => {
      const taskId = 1;
      const userId = 1;
      const error = new Error('Database connection error');

      jest.spyOn(repository, 'findOne').mockResolvedValue({
        task_id: taskId,
        user_id: userId,
        task: new Tasks(),
        user: new Users(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      jest.spyOn(repository, 'remove').mockRejectedValue(error);

      await expect(service.remove(taskId, userId)).rejects.toThrow(
        'Database connection error',
      );
    });
  });
});
