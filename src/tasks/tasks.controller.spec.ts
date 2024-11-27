import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tasks } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';
import { KeyResults } from '../key_results/entities/key_result.entity';
import { ColumnsKeyResults } from '../columns_key_result/entities/columns_key_result.entity';

const mockTasksService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () =>{
    it('should create a task', async () => {
      const createDto: CreateTaskDto = {
        key_result_id: 1,
        task_name: 'Task 1',
        description: 'Description',
        delay_reason: 'Reason',
        priority: 1,
        due_date: new Date(),
        column_key_result_id: 1,
      };
      const createdTask: Tasks = {
        id: 1,
        ...createDto,
        created_at: new Date(),
        updated_at: new Date(),
        keyResultId: new KeyResults(),
        columnKeyResultId: new ColumnsKeyResults()
      };
  
      jest.spyOn(service, 'create').mockResolvedValue(createdTask);
  
      const result = await controller.create(createDto);
  
      expect(result).toEqual(createdTask);
    });
  });

  describe('findAll', () => {
    it('should find all tasks by keyResultId', async () => {
      const keyResultId = 1;
      const mockTasks: Tasks[] = [
        {
          id: 1,
          key_result_id: keyResultId,
          task_name: 'Task 1',
          description: 'Description 1',
          delay_reason: 'Reason 1',
          priority: 1,
          due_date: new Date(),
          column_key_result_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          keyResultId: new KeyResults(),
          columnKeyResultId: new ColumnsKeyResults(),
        },
        {
          id: 2,
          key_result_id: keyResultId,
          task_name: 'Task 2',
          description: 'Description 2',
          delay_reason: 'Reason 2',
          priority: 2,
          due_date: new Date(),
          column_key_result_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
          keyResultId: new KeyResults(),
          columnKeyResultId: new ColumnsKeyResults(),
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockTasks);

      const result = await controller.findAll(keyResultId);

      expect(result).toEqual(mockTasks);
    });
  });

  describe('findOne', () => {
    it('should find a task by id', async () => {
      const taskId = 1;
      const mockTask: Tasks = {
        id: taskId,
        key_result_id: 1,
        task_name: 'Task 1',
        description: 'Description 1',
        delay_reason: 'Reason 1',
        priority: 1,
        due_date: new Date(),
        column_key_result_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        keyResultId: new KeyResults(),
        columnKeyResultId: new ColumnsKeyResults(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTask);

      const result = await controller.findOne(taskId);

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task is not found', async () => {
      const taskId = 999;
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      try {
        await controller.findOne(taskId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Task with id ${taskId} not found`);
      }
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = 1;
      const updateDto: UpdateTaskDto = {
        task_name: 'Updated Task',
        description: 'Updated Description',
        delay_reason: 'Updated Reason',
        priority: 2,
        due_date: new Date(),
        column_key_result_id: 2,
      };
      const existingTask: Tasks = {
        id: taskId,
        key_result_id: 1,
        task_name: 'Task 1',
        description: 'Description 1',
        delay_reason: 'Reason 1',
        priority: 1,
        due_date: new Date(),
        column_key_result_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        keyResultId: new KeyResults(),
        columnKeyResultId: new ColumnsKeyResults(),
      };
      const updatedTask: Tasks = {
        ...existingTask,
        ...updateDto,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedTask);

      const result = await controller.update(taskId, updateDto);

      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFoundException if task is not found during update', async () => {
      const taskId = 999;
      const updateDto: UpdateTaskDto = {
        task_name: 'Updated Task',
        description: 'Updated Description',
        delay_reason: 'Updated Reason',
        priority: 2,
        due_date: new Date(),
        column_key_result_id: 2,
      };

      jest.spyOn(service, 'update').mockImplementation(async () => {
        throw new NotFoundException(`Task ${taskId} not found`);
      });

      try {
        await controller.update(taskId, updateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Task ${taskId} not found`);
      }
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const taskId = 1;
      const mockTask: Tasks = {
        id: taskId,
        key_result_id: 1,
        task_name: 'Task 1',
        description: 'Description 1',
        delay_reason: 'Reason 1',
        priority: 1,
        due_date: new Date(),
        column_key_result_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        keyResultId: new KeyResults(),
        columnKeyResultId: new ColumnsKeyResults(),
      };

      jest.spyOn(service, 'remove').mockResolvedValue(mockTask);

      const result = await controller.remove(taskId);

      expect(result).toEqual(mockTask);
    });

    it('should throw an error if task is not found during removal', async () => {
      const taskId = 999;

      jest.spyOn(service, 'remove').mockImplementation(async () => {
        throw new NotFoundException('Task not found');
      });

      try {
        await controller.remove(taskId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Task not found');
      }
    });
  });
});
