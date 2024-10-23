import { Test, TestingModule } from '@nestjs/testing';
import { KeyResultsService } from './key_results.service';
import { Repository } from 'typeorm';
import { KeyResult } from './entities/key_result.entity';
import { CreateKeyResultDto } from './dto/create-key_result.dto';
import { UpdateKeyResultDto } from './dto/update-key_result.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Objective } from '../objectives/entities/objective.entity';

const mockKeyResultsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
};

describe('KeyResultsService', () => {
  let service: KeyResultsService;
  let repository: Repository<KeyResult>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeyResultsService,
        {
          provide: getRepositoryToken(KeyResult),
          useValue: mockKeyResultsRepository,
        },
      ],
    }).compile();

    service = module.get<KeyResultsService>(KeyResultsService);
    repository = module.get<Repository<KeyResult>>(
      getRepositoryToken(KeyResult),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a key result', async () => {
      const createKeyResultDto: CreateKeyResultDto = {
        objective_id: 1,
        key_result_name: 'Example Key Result',
        description: 'Example description',
        status: 'In Progress',
        start_date: new Date(),
        end_date: new Date(),
      };

      const createdKeyResult: KeyResult = {
        id: 1,
        ...createKeyResultDto,
        created_at: new Date(),
        updated_at: new Date(),
        objective: new Objective(),
      };

      mockKeyResultsRepository.create.mockReturnValue(createKeyResultDto);
      mockKeyResultsRepository.save.mockResolvedValue(createdKeyResult);

      const result = await service.create(createKeyResultDto);

      expect(result).toEqual(createdKeyResult);
      expect(mockKeyResultsRepository.create).toHaveBeenCalledWith(
        createKeyResultDto,
      );
      expect(mockKeyResultsRepository.save).toHaveBeenCalledWith(
        createKeyResultDto,
      );
    });
  });

  describe('findAll', () => {
    it('should find all key results by objective ID', async () => {
      const objectiveId = 1;
      const mockKeyResults = [
        {
          id: 1,
          objective_id: objectiveId,
          key_result_name: 'Key Result 1',
          description: 'Description 1',
          status: 'In Progress',
          start_date: new Date(),
          end_date: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          objective: new Objective(),
        },
        {
          id: 2,
          objective_id: objectiveId,
          key_result_name: 'Key Result 2',
          description: 'Description 2',
          status: 'Completed',
          start_date: new Date(),
          end_date: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          objective: new Objective(),
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockKeyResults);

      const result = await service.findAll(objectiveId);

      expect(result).toEqual(mockKeyResults);
      expect(repository.find).toHaveBeenCalledWith({
        where: { objective_id: objectiveId },
      });
    });
  });

  describe('findOne', () => {
    it('should find one key result by ID', async () => {
      const keyResultId = 1;
      const mockKeyResult = {
        id: keyResultId,
        objective_id: 1,
        key_result_name: 'Example Key Result',
        description: 'Example description',
        status: 'In Progress',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        objective: new Objective(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockKeyResult);

      const result = await service.findOne(keyResultId);

      expect(result).toEqual(mockKeyResult);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: keyResultId },
      });
    });
  });

  describe('update', () => {
    it('should update a key result', async () => {
      const keyResultId = 1;
      const updateKeyResultDto: UpdateKeyResultDto = {
        key_result_name: 'Updated Key Result',
        description: 'Updated description',
        status: 'Completed',
        start_date: new Date('2022-07-01'),
        end_date: new Date('2022-12-31'),
      };

      const existingKeyResult: KeyResult = {
        id: keyResultId,
        objective_id: 1,
        key_result_name: 'Existing Key Result',
        description: 'Existing description',
        status: 'In Progress',
        start_date: new Date('2022-01-01'),
        end_date: new Date('2022-06-30'),
        created_at: new Date(),
        updated_at: new Date(),
        objective: new Objective(),
      };

      const updatedKeyResult: KeyResult = {
        id: keyResultId,
        objective_id: 1,
        key_result_name: updateKeyResultDto.key_result_name || '',
        description: updateKeyResultDto.description || '',
        status: updateKeyResultDto.status || '',
        start_date: updateKeyResultDto.start_date || new Date(),
        end_date: updateKeyResultDto.end_date || new Date(),
        created_at: existingKeyResult.created_at,
        updated_at: new Date(),
        objective: existingKeyResult.objective,
      };

      jest.spyOn(repository, 'preload').mockResolvedValue(updatedKeyResult);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedKeyResult);

      const result = await service.update(keyResultId, updateKeyResultDto);

      expect(result).toEqual(updatedKeyResult);
    });
  });

  describe('remove', () => {
    it('should remove a key result', async () => {
      const keyResultId = 1;
      const mockKeyResult = {
        id: keyResultId,
        objective_id: 1,
        key_result_name: 'Example Key Result',
        description: 'Example description',
        status: 'In Progress',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        objective: new Objective(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockKeyResult);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockKeyResult);

      const result = await service.remove(keyResultId);

      expect(result).toEqual(mockKeyResult);
      expect(service.findOne).toHaveBeenCalledWith(keyResultId);
      expect(repository.remove).toHaveBeenCalledWith(mockKeyResult);
    });
  });
});
