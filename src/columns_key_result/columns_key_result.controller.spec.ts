import { Test, TestingModule } from '@nestjs/testing';
import { ColumnsKeyResultController } from './columns_key_result.controller';
import { ColumnsKeyResultService } from './columns_key_result.service';
import { ColumnsKeyResult } from './entities/columns_key_result.entity';
import { CreateColumnsKeyResultDto } from './dto/create-columns_key_result.dto';
import { KeyResult } from '../key_results/entities/key_result.entity';
import { NotFoundException } from '@nestjs/common';

const mockColumnsKeyResultService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ColumnsKeyResultController', () => {
  let controller: ColumnsKeyResultController;
  let service: ColumnsKeyResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColumnsKeyResultController],
      providers: [
        {
          provide: ColumnsKeyResultService,
          useValue: mockColumnsKeyResultService,
        },
      ],
    }).compile();

    controller = module.get<ColumnsKeyResultController>(
      ColumnsKeyResultController,
    );
    service = module.get<ColumnsKeyResultService>(ColumnsKeyResultService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call columns key result create with the correct values', async () => {
      const createColumnsKeyResultDto: CreateColumnsKeyResultDto = {
        key_result_id: 1,
        column_name: 'Example Column Name',
        position: 1,
      };

      const createdColumnsKeyResult: ColumnsKeyResult = {
        id: 1,
        ...createColumnsKeyResultDto,
        created_at: new Date(),
        updated_at: new Date(),
        keyResult: new KeyResult(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdColumnsKeyResult);

      const result = await controller.create(createColumnsKeyResultDto);

      expect(result).toEqual(createdColumnsKeyResult);
      expect(service.create).toHaveBeenCalledWith(createColumnsKeyResultDto);
    });
  });

  describe('findAll', () => {
    it('should call columns key result service to find all columns by key result ID', async () => {
      const keyResultId = 1;
      const mockColumnsKeyResults: ColumnsKeyResult[] = [
        {
          id: 1,
          key_result_id: keyResultId,
          column_name: 'Column 1',
          position: 1,
          created_at: new Date(),
          updated_at: new Date(),
          keyResult: new KeyResult(),
        },
        {
          id: 2,
          key_result_id: keyResultId,
          column_name: 'Column 2',
          position: 2,
          created_at: new Date(),
          updated_at: new Date(),
          keyResult: new KeyResult(),
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockColumnsKeyResults);

      const result = await controller.findAll(keyResultId);

      expect(result).toEqual(mockColumnsKeyResults);
      expect(service.findAll).toHaveBeenCalledWith(keyResultId);
    });

    it('should handle errors when finding all columns by key result ID', async () => {
      const keyResultId = 1;
      const errorMessage = 'Database connection error';

      jest.spyOn(service, 'findAll').mockRejectedValue(new Error(errorMessage));

      await expect(controller.findAll(keyResultId)).rejects.toThrow(
        errorMessage,
      );
      expect(service.findAll).toHaveBeenCalledWith(keyResultId);
    });
  });

  describe('findOne', () => {
    it('should call columns key result service to find one column by ID', async () => {
      const columnId = 1;
      const mockColumn: ColumnsKeyResult = {
        id: columnId,
        key_result_id: 1,
        column_name: 'Example Column',
        position: 1,
        created_at: new Date(),
        updated_at: new Date(),
        keyResult: new KeyResult(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockColumn);

      const result = await controller.findOne(columnId);

      expect(result).toEqual(mockColumn);
      expect(service.findOne).toHaveBeenCalledWith(columnId);
    });

    it('should handle errors when finding one column by ID', async () => {
      const columnId = 1;
      const errorMessage = 'Column not found';

      jest.spyOn(service, 'findOne').mockRejectedValue(new Error(errorMessage));

      await expect(controller.findOne(columnId)).rejects.toThrow(
        errorMessage,
      );
      expect(service.findOne).toHaveBeenCalledWith(columnId);
    });
  });

  describe('update', () => {
    it('should call columns key result service to update a column by ID', async () => {
      const columnId = 1;
      const updateColumnsKeyResultDto = {
        column_name: 'Updated Column Name',
        position: 2,
      };

      const updatedColumnsKeyResult: ColumnsKeyResult = {
        id: columnId,
        key_result_id: 1,
        ...updateColumnsKeyResultDto,
        created_at: new Date(),
        updated_at: new Date(),
        keyResult: new KeyResult(),
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedColumnsKeyResult);

      const result = await controller.update(
        columnId,
        updateColumnsKeyResultDto,
      );

      expect(result).toEqual(updatedColumnsKeyResult);
      expect(service.update).toHaveBeenCalledWith(
        columnId,
        updateColumnsKeyResultDto,
      );
    });

    it('should handle errors when updating a column by ID', async () => {
      const columnId = 1;
      const updateColumnsKeyResultDto = {
        column_name: 'Updated Column Name',
        position: 2,
      };
      const errorMessage = 'Column update failed';

      jest.spyOn(service, 'update').mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.update(columnId, updateColumnsKeyResultDto),
      ).rejects.toThrow(errorMessage);
      expect(service.update).toHaveBeenCalledWith(
        columnId,
        updateColumnsKeyResultDto,
      );
    });

    it('should handle not found error when updating a non-existing column', async () => {
      const columnId = 999;
      const updateColumnsKeyResultDto = {
        column_name: 'Updated Column Name',
        position: 2,
      };
      const errorMessage = `Column ${columnId} not found`;

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new NotFoundException(errorMessage));

      await expect(
        controller.update(columnId, updateColumnsKeyResultDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(
        columnId,
        updateColumnsKeyResultDto,
      );
    });
  });

  describe('remove', () => {
    it('should call columns key result service to remove a column by ID', async () => {
      const columnId = 1;
      const mockColumn: ColumnsKeyResult = {
        id: columnId,
        key_result_id: 1,
        column_name: 'Example Column',
        position: 1,
        created_at: new Date(),
        updated_at: new Date(),
        keyResult: new KeyResult(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockColumn);
      jest.spyOn(service, 'remove').mockResolvedValue(mockColumn);

      const result = await controller.remove(columnId);

      expect(result).toBe(mockColumn);
      expect(service.remove).toHaveBeenCalledWith(columnId);
    });

    it('should handle errors when removing a column by ID', async () => {
      const columnId = 1;
      const errorMessage = 'Column removal failed';

      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      jest.spyOn(service, 'remove').mockRejectedValue(new Error(errorMessage));

      await expect(controller.remove(columnId)).rejects.toThrow(
        errorMessage,
      );
      expect(service.remove).toHaveBeenCalledWith(columnId);
    });
  });
});
