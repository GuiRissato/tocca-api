import { Test, TestingModule } from '@nestjs/testing';
import { ObjectivesController } from './objectives.controller';
import { ObjectivesService } from './objectives.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';

const mockObjectivesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ObjectivesController', () => {
  let controller: ObjectivesController;
  let service: ObjectivesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectivesController],
      providers: [
        {
          provide: ObjectivesService,
          useValue: mockObjectivesService,
        },
      ],
    }).compile();

    controller = module.get<ObjectivesController>(ObjectivesController);
    service = module.get<ObjectivesService>(ObjectivesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call objectives create with the correct values', async () => {
      const createObjectiveDto: CreateObjectiveDto = {
        project_id: 1,
        objective_name: 'objective 1',
        description: 'description 1',
        status: '',
        start_date: new Date(),
        end_date: new Date(),
      };

      const createdObjective = { id: 1, ...createObjectiveDto };

      mockObjectivesService.create.mockResolvedValue(createdObjective);

      const result = await controller.create(createObjectiveDto);

      expect(service.create).toHaveBeenCalledWith(createObjectiveDto);
      expect(result).toEqual(createdObjective);
    });
  });

  describe('findAll', () => {
    it('should return all objectives from a project id', async () => {
      const objectives: CreateObjectiveDto[] = [
        {
          project_id: 1,
          objective_name: 'objective 1',
          description: 'description 1',
          status: '',
          start_date: new Date(),
          end_date: new Date(),
        },
        {
          project_id: 1,
          objective_name: 'objective 2',
          description: 'description 2',
          status: '',
          start_date: new Date(),
          end_date: new Date(),
        },
      ];

      mockObjectivesService.findAll.mockResolvedValue(objectives);

      const result = await controller.findAll(1);

      expect(service.findAll).toHaveBeenCalledWith(1);
      expect(result).toEqual(objectives);
    });
  });

  describe('findOne', () => {
    it('should return a specific objective by ID', async () => {
      const objectiveId = 1;
      const objective: CreateObjectiveDto = {
        project_id: 1,
        objective_name: 'objective 1',
        description: 'description 1',
        status: '',
        start_date: new Date(),
        end_date: new Date(),
      };

      mockObjectivesService.findOne.mockResolvedValue(objective);

      const result = await controller.findOne(objectiveId);

      expect(service.findOne).toHaveBeenCalledWith(objectiveId);
      expect(result).toEqual(objective);
    });
  });

  describe('update', () => {
    it('should update an objective with the provided data', async () => {
      const objectiveId = 1;
      const updateObjectiveDto: UpdateObjectiveDto = {
        objective_name: 'updated objective',
        description: 'updated description',
        status: 'in progress',
      };

      const updatedObjective = { id: objectiveId, ...updateObjectiveDto };

      mockObjectivesService.update.mockResolvedValue(updatedObjective);

      const result = await controller.update(objectiveId, updateObjectiveDto);

      expect(service.update).toHaveBeenCalledWith(
        objectiveId,
        updateObjectiveDto,
      );
      expect(result).toEqual(updatedObjective);
    });
  });

  describe('remove', () => {
    it('should remove an objective based on the provided ID', async () => {
      const objectiveId = 1;
      const removedObjective: CreateObjectiveDto = {
        project_id: 1,
        objective_name: 'removed objective',
        description: 'removed description',
        status: '',
        start_date: new Date(),
        end_date: new Date(),
      };

      mockObjectivesService.remove.mockResolvedValue(removedObjective);

      const result = await controller.remove(objectiveId);

      expect(service.remove).toHaveBeenCalledWith(objectiveId);
      expect(result).toEqual(removedObjective);
    });
  });
});
