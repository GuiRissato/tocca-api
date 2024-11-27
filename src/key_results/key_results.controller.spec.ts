import { Test, TestingModule } from '@nestjs/testing';
import { KeyResultsController } from './key_results.controller';
import { KeyResultsService } from './key_results.service';
import { CreateKeyResultDto } from './dto/create-key_result.dto';
import { KeyResults } from './entities/key_result.entity';
import { Objectives } from '../objectives/entities/objective.entity';

const mockKeyResultService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('KeyResultsController', () => {
  let controller: KeyResultsController;
  let service: KeyResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyResultsController],
      providers: [
        {
          provide: KeyResultsService,
          useValue: mockKeyResultService,
        },
      ],
    }).compile();

    controller = module.get<KeyResultsController>(KeyResultsController);
    service = module.get<KeyResultsService>(KeyResultsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call key result create with the correct values', async () => {
      const createKeyResultDto: CreateKeyResultDto = {
        objective_id: 1,
        key_result_name: 'Example Key Result',
        description: 'Example description',
        status: 'In Progress',
        start_date: new Date(),
        end_date: new Date(),
      };

      const createdKeyResult: KeyResults = {
        id: 1,
        ...createKeyResultDto,
        objective: new Objectives(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdKeyResult);

      const result = await controller.create(createKeyResultDto);

      expect(result).toEqual(createdKeyResult);
      expect(service.create).toHaveBeenCalledWith(createKeyResultDto);
    });
  });

  describe('findAll', () => {
    it('should return all key results from a objective id', async () => {
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
          objective: new Objectives(),
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
          objective: new Objectives(),
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockKeyResults);

      const result = await controller.findAll(objectiveId);

      expect(result).toEqual(mockKeyResults);
      expect(service.findAll).toHaveBeenCalledWith(objectiveId);
    });
  });

  describe('findOne', () => {
    it('should return a specific key result by ID', async () => {
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
        objective: new Objectives(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockKeyResult);

      const result = await controller.findOne(keyResultId);

      expect(result).toEqual(mockKeyResult);
      expect(service.findOne).toHaveBeenCalledWith(keyResultId);
    });
  });

  describe('update', () => {
    it('should update an key result with the provided data', async () => {
      const keyResultId = 1;
      const updateKeyResultDto = {
        key_result_name: 'Updated Key Result',
        description: 'Updated description',
        status: 'Completed',
        start_date: new Date('2022-07-01'),
        end_date: new Date('2022-12-31'),
      };

      const updatedKeyResult = {
        id: keyResultId,
        objective_id: 1,
        ...updateKeyResultDto,
        created_at: new Date(),
        updated_at: new Date(),
        objective: new Objectives(),
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedKeyResult);

      const result = await controller.update(keyResultId, updateKeyResultDto);

      expect(result).toEqual(updatedKeyResult);
      expect(service.update).toHaveBeenCalledWith(
        keyResultId,
        updateKeyResultDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove an key result based on the provided ID', async () => {
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
        objective: new Objectives(),
      };

      jest.spyOn(service, 'remove').mockResolvedValue(mockKeyResult);

      const result = await controller.remove(keyResultId);

      expect(result).toEqual(mockKeyResult);
      expect(service.remove).toHaveBeenCalledWith(keyResultId);
    });
  });
});
