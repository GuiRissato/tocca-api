import { Test, TestingModule } from '@nestjs/testing';
import { TaskAssigneesController } from './task_assignee.controller';
import { TaskAssigneesService } from './task_assignees.service';
import { CreateTaskAssigneeDto } from './dto/create-task_assignee.dto';
import { UpdateTaskAssigneeDto } from './dto/update-task_assignee.dto';
import { TaskAssignees } from './entities/task_assignee.entity';
import { NotFoundException } from '@nestjs/common';
import { Tasks } from '../tasks/entities/task.entity';
import { Users } from '../users/entities/user.entity';

const mockTaskAssigneesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('TaskAssigneesController', () => {
  let controller: TaskAssigneesController;
  let service: TaskAssigneesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskAssigneesController],
      providers: [
        {
          provide: TaskAssigneesService,
          useValue: mockTaskAssigneesService,
        },
      ],
    }).compile();

    controller = module.get<TaskAssigneesController>(TaskAssigneesController);
    service = module.get<TaskAssigneesService>(TaskAssigneesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task assignee', async () => {
      const createDto: CreateTaskAssigneeDto = {
        task_id: 1,
        user_id: 1,
      };
      const createdTaskAssignee: TaskAssignees = {
        task_id: 1,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        task: new Tasks(),
        user: new Users(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdTaskAssignee);

      const result = await controller.create(createDto);

      expect(result).toEqual(createdTaskAssignee);
    });
  });

  describe('findAll', () => {
    it('should find all task assignees for a specific task', async () => {
      const taskId = 1;
      const taskAssignees: TaskAssignees[] = [
        {
          task_id: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          task: new Tasks(),
          user: new Users(),
        },
        {
          task_id: 1,
          user_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
          task: new Tasks(),
          user: new Users(),
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(taskAssignees);

      const result = await controller.findAll(taskId);

      expect(result).toEqual(taskAssignees);
    });

    it('should throw an error if an error occurs during finding task assignees', async () => {
      const taskId = 1;
      const errorMessage = 'Database connection error';

      jest.spyOn(service, 'findAll').mockRejectedValue(new Error(errorMessage));

      await expect(controller.findAll(taskId)).rejects.toThrow(errorMessage);
    });
  });

  describe('findOne', () => {
    it('should find a specific task assignee by task and user id', async () => {
      const taskId = 1;
      const userId = 1;
      const taskAssignee: TaskAssignees = {
        task_id: taskId,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
        task: new Tasks(),
        user: new Users(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(taskAssignee);

      const result = await controller.findOne(taskId, userId);

      expect(result).toEqual(taskAssignee);
    });

    it('should throw a NotFoundException if the task assignee is not found', async () => {
      const taskId = 1;
      const userId = 999;
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);
      try {
        controller.findOne(taskId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Task assignee with id ${taskId} - ${userId} not found`)
      }
    });

    it('should throw an error if an error occurs during finding the task assignee', async () => {
      const taskId = 1;
      const userId = 1;
      const errorMessage = 'Database connection error';

      jest.spyOn(service, 'findOne').mockRejectedValue(new Error(errorMessage));

      await expect(controller.findOne(taskId, userId)).rejects.toThrow(errorMessage);
    });
  });

  describe('update', () => {
    it('should update a task assignee successfully', async () => {
      const taskId = 1;
      const userId = 1;
      const updateDto: UpdateTaskAssigneeDto = {
        // Incluir os campos que deseja atualizar no DTO
      };
      const updatedTaskAssignee: TaskAssignees = {
        task_id: taskId,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
        task: new Tasks(),
        user: new Users(),
        // Incluir os campos atualizados conforme o DTO
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedTaskAssignee);

      const result = await controller.update(taskId, userId, updateDto);

      expect(result).toEqual(updatedTaskAssignee);
    });

    it('should throw a NotFoundException if the task assignee to update is not found', async () => {
      const taskId = 1;
      const userId = 1;
      const updateDto: UpdateTaskAssigneeDto = {
        task_id: 2
      };
      
      jest.spyOn(service, 'update').mockImplementation(async () => {
        throw new NotFoundException(`Error on Database`);
      })

      try {
        await controller.update(taskId, userId, updateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Error on Database');
      }
    });

    it('should throw an error if an error occurs during the update process', async () => {
      const taskId = 1;
      const userId = 1;
      const updateDto: UpdateTaskAssigneeDto = {
        task_id: 999,
        user_id: 888
      };
     
      jest.spyOn(service,'update').mockImplementation(async () => {
        throw new NotFoundException(`Task assignee with task_id ${taskId} and user_id ${userId} not found`)
      });

      try {
        await controller.update(taskId,userId,updateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Task assignee with task_id ${taskId} and user_id ${userId} not found`)
        
      }
    });
  });

  describe('remove', () => {
    it('should remove a task assignee successfully', async () => {
      const taskId = 1;
      const userId = 1;
      const taskAssigneeToRemove: TaskAssignees = {
        task_id: taskId,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
        task: new Tasks(),
        user: new Users(),
      };

      jest.spyOn(service, 'remove').mockResolvedValue(taskAssigneeToRemove);

      const result = await controller.remove(taskId, userId);

      expect(result).toEqual(taskAssigneeToRemove);
    });

    it('should throw a NotFoundException if the task assignee to remove is not found', async () => {
      const taskId = 1;
      const userId = 999;
      
      jest.spyOn(service, 'remove').mockImplementation(async () => {
        throw new NotFoundException(`Task assignee with task_id ${taskId} and user_id ${userId} not found`);
      });

      try {
        await controller.remove(taskId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Task assignee with task_id ${taskId} and user_id ${userId} not found`);
      }



      await expect(controller.remove(taskId, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if an error occurs during the removal process', async () => {
      const taskId = 1;
      const userId = 1;
      
      const errorMessage = 'Database connection error';

      jest.spyOn(service, 'remove').mockRejectedValue(new Error(errorMessage));

      await expect(controller.remove(taskId, userId)).rejects.toThrow(errorMessage);
    });
  });  
});
