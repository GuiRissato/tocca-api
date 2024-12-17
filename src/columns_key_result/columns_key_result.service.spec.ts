import { Test, TestingModule } from '@nestjs/testing';
import { ColumnsKeyResultService } from './columns_key_result.service';
import { Repository } from 'typeorm';
import { ColumnsKeyResults } from './entities/columns_key_result.entity';
import { CreateColumnsKeyResultDto } from './dto/create-columns_key_result.dto';
import { UpdateColumnsKeyResultDto } from './dto/update-columns_key_result.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { KeyResults } from '../key_results/entities/key_result.entity';

const mockColumnsKeyResultRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
};

describe('ColumnsKeyResultService', () => {
  let service: ColumnsKeyResultService;
  let repository: Repository<ColumnsKeyResults>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColumnsKeyResultService,
        {
          provide: getRepositoryToken(ColumnsKeyResults),
          useValue: mockColumnsKeyResultRepository,
        },
      ],
    }).compile();

    service = module.get<ColumnsKeyResultService>(ColumnsKeyResultService);
    repository = module.get<Repository<ColumnsKeyResults>>(
      getRepositoryToken(ColumnsKeyResults),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a column key result', async () => {
      const createColumnsKeyResultDto: CreateColumnsKeyResultDto = {
        key_result_id: 1,
        column_name: 'Test Column',
        position: 1,
      };

      const createdColumn = { ...createColumnsKeyResultDto, id: 1 };
      mockColumnsKeyResultRepository.create.mockReturnValue(
        createColumnsKeyResultDto,
      );
      mockColumnsKeyResultRepository.save.mockResolvedValue(createdColumn);

      const result = await service.create(createColumnsKeyResultDto);

      expect(result).toEqual(createdColumn);
      expect(mockColumnsKeyResultRepository.create).toHaveBeenCalledWith(
        createColumnsKeyResultDto,
      );
      expect(mockColumnsKeyResultRepository.save).toHaveBeenCalledWith(
        createColumnsKeyResultDto,
      );
    });
  });

  describe('findAll', () => {
    it('should find all columns by key result ID', async () => {
      const keyResultId = 1;
      const columns = [
        {
          id: 1,
          key_result_id: keyResultId,
          column_name: 'Test Column 1',
          position: 1,
        },
        {
          id: 2,
          key_result_id: keyResultId,
          column_name: 'Test Column 2',
          position: 2,
        },
      ];

      mockColumnsKeyResultRepository.find.mockReturnValue(columns);

      const result = await service.findAll(keyResultId);

      expect(result).toEqual(columns);
      expect(mockColumnsKeyResultRepository.find).toHaveBeenCalledWith({
        where: { key_result_id: keyResultId },
      });
    });
  });

  describe('findOne', () => {
    it('should find one column by ID', async () => {
      const columnId = 1;
      const column = {
        id: columnId,
        key_result_id: 1,
        column_name: 'Test Column',
        position: 1,
      };

      mockColumnsKeyResultRepository.findOne.mockReturnValue(column);

      const result = await service.findOne(columnId);

      expect(result).toEqual(column);
      expect(mockColumnsKeyResultRepository.findOne).toHaveBeenCalledWith({
        where: { id: columnId },
      });
    });

    it('should throw an error if column is not found', async () => {
      const columnId = 999; // Assuming this ID does not exist
      mockColumnsKeyResultRepository.findOne.mockReturnValue(undefined);

      try {
        await service.findOne(columnId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Column ${columnId} not found`);
      }
    });
  });

  describe('update', () => {
    it('should update a column key result', async () => {
      const columnId = 1;
      const updateColumnsKeyResultDto: UpdateColumnsKeyResultDto = {
        column_name: 'Updated Column Name',
        position: 2,
      };

      const existingColumn = {
        id: columnId,
        key_result_id: 1,
        column_name: 'Test Column',
        position: 1,
      };

      const updatedColumn = { ...existingColumn, ...updateColumnsKeyResultDto };
      mockColumnsKeyResultRepository.findOne.mockReturnValue(existingColumn);
      mockColumnsKeyResultRepository.preload.mockReturnValue(updatedColumn);
      mockColumnsKeyResultRepository.save.mockResolvedValue(updatedColumn);

      const result = await service.update(columnId, updateColumnsKeyResultDto);

      expect(result).toEqual(updatedColumn);
      expect(mockColumnsKeyResultRepository.findOne).toHaveBeenCalledWith({
        where: { id: columnId },
      });
      expect(mockColumnsKeyResultRepository.preload).toHaveBeenCalledWith({
        id: columnId,
        ...updateColumnsKeyResultDto,
      });
      expect(mockColumnsKeyResultRepository.save).toHaveBeenCalledWith(
        updatedColumn,
      );
    });

    it('should throw an error if column is not found during update', async () => {
      const columnId = 999; // Assuming this ID does not exist
      mockColumnsKeyResultRepository.findOne.mockReturnValue(undefined);

      try {
        await service.update(columnId, {
          column_name: 'Updated Column Name',
          position: 2,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Column ${columnId} not found`);
      }
    });
  });

  describe('remove', () => {
    it('should remove a column key result', async () => {
      const columnId = 1;
      const mockColumn: ColumnsKeyResults = {
        id: columnId,
        key_result_id: 1,
        column_name: 'Test Column',
        position: 1,
        keyResult: new KeyResults(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockColumn);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockColumn);

      const result = await service.remove(columnId);

      expect(result).toEqual(mockColumn);
      expect(service.findOne).toHaveBeenCalledWith(columnId);
      expect(repository.remove).toHaveBeenCalledWith(mockColumn);
    });

    it('should throw an error if column is not found during removal', async () => {
      const columnId = 999; // Assuming this ID does not exist
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      try {
        await service.remove(columnId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Column ${columnId} not found`);
      }
    });
  });
});
