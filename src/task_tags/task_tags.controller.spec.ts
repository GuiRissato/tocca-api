import { Test, TestingModule } from '@nestjs/testing';
import { TaskTagsController } from './task_tags.controller';
import { TaskTagsService } from './task_tags.service';
import { CreateTaskTagDto } from './dto/create-task_tag.dto'; 
  import { UpdateTaskTagDto } from './dto/update-task_tag.dto'; 
import { NotFoundException } from '@nestjs/common';

describe('TaskTagsController', () => {
  let controller: TaskTagsController;
  let service: TaskTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskTagsController],
      providers: [
        {
          provide: TaskTagsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskTagsController>(TaskTagsController);
    service = module.get<TaskTagsService>(TaskTagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const dto = new CreateTaskTagDto();
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with correct parameters', async () => {
      const taskId = 1;
      await controller.findAll(taskId);
      expect(service.findAll).toHaveBeenCalledWith(taskId);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct parameters', async () => {
      const taskId = 1;
      const tagId = 2;
      await controller.findOne(taskId, tagId);
      expect(service.findOne).toHaveBeenCalledWith(taskId, tagId);
    });

    it('should throw NotFoundException if service.findOne throws', async () => {
      const taskId = 1;
      const tagId = 2;
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());
      await expect(controller.findOne(taskId, tagId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const taskId = 1;
      const tagId = 2;
      const dto = new UpdateTaskTagDto();
      await controller.update(taskId, tagId, dto);
      expect(service.update).toHaveBeenCalledWith(taskId, tagId, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct parameters', async () => {
      const taskId = 1;
      const tagId = 2;
      await controller.remove(taskId, tagId);
      expect(service.remove).toHaveBeenCalledWith(taskId, tagId);
    });
  });
});