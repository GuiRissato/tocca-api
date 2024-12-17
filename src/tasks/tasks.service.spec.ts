import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tasks } from './entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KeyResults } from '../key_results/entities/key_result.entity';
import { ColumnsKeyResults } from '../columns_key_result/entities/columns_key_result.entity'
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Tasks>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Tasks),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Tasks>>(getRepositoryToken(Tasks));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
  
      jest.spyOn(repository, 'create').mockReturnValue(createdTask);
      jest.spyOn(repository, 'save').mockResolvedValue(createdTask);
  
      const result = await service.create(createDto);
  
      expect(result).toEqual(createdTask);
    });
  })

  describe('findAll', () =>{
    it('should find all tasks by key_result_id', async () => {
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

      jest.spyOn(repository, 'find').mockResolvedValue(mockTasks);

      const result = await service.findAll(keyResultId);

      expect(result).toEqual(mockTasks);
    });
  })

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

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTask);

      const result = await service.findOne(taskId);

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task is not found', async () => {
      const taskId = 999;

      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      try {
        await service.findOne(taskId);
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

      jest.spyOn(repository, 'preload').mockResolvedValue(updatedTask);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedTask);

      const result = await service.update(taskId, updateDto);

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

      jest.spyOn(repository, 'preload').mockResolvedValue(undefined);

      try {
        await service.update(taskId, updateDto);
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

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTask);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockTask);

      const result = await service.remove(taskId);

      expect(result).toEqual(mockTask);
    });

    it('should throw an error if task is not found during removal', async () => {
      const taskId = 999; // Non-existent task ID

      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      try {
        await service.remove(taskId);
      } catch (error) {
        expect(error).toBe('Error deleting task');
      }
    });
  });
  // Add more test cases for findAll, findOne, update, and remove methods following a similar pattern as in okr_projects.service.spec.ts
});