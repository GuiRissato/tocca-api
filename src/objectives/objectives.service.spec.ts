import { Test, TestingModule } from '@nestjs/testing';
import { ObjectivesService } from './objectives.service';
import { Repository } from 'typeorm';
import { Objectives } from './entities/objective.entity';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OkrProjects } from '../okr_projects/entities/okr_project.entity';

const mockObjectivesRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
};

describe('ObjectivesService', () => {
  let service: ObjectivesService;
  let repository: Repository<Objectives>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectivesService,
        {
          provide: getRepositoryToken(Objectives),
          useValue: mockObjectivesRepository,
        },
      ],
    }).compile();

    service = module.get<ObjectivesService>(ObjectivesService);
    repository = module.get<Repository<Objectives>>(
      getRepositoryToken(Objectives),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an objective', async () => {
      const createObjectiveDto: CreateObjectiveDto = {
        project_id: 1,
        objective_name: 'Objective 1',
        description: 'Description 1',
        status: '',
        start_date: new Date(),
        end_date: new Date(),
      };
      const createdObjective: Objectives = {
        id: 1,
        project_id: 1,
        objective_name: 'Objective 1',
        description: 'Description 1',
        created_at: new Date(),
        updated_at: new Date(),
        status: '',
        start_date: new Date(),
        end_date: new Date(),
        project: new OkrProjects(),
      };

      jest.spyOn(repository, 'create').mockReturnValue(createdObjective);
      jest.spyOn(repository, 'save').mockResolvedValue(createdObjective);

      const result = await service.create(createObjectiveDto);

      expect(result).toEqual(createdObjective);
    });
  });

  describe('findAll', () => {
    it('should find all objectives by project ID', async () => {
      const projectId = 1;
      const mockObjectives: Objectives[] = [
        {
          id: 1,
          project_id: projectId,
          objective_name: 'Objective 1',
          description: 'Description 1',
          created_at: new Date(),
          updated_at: new Date(),
          status: 'progress',
          start_date: new Date(),
          end_date: new Date(),
          project: new OkrProjects(),
        },
        {
          id: 2,
           project_id: projectId,
           objective_name: 'Objective 2',
           description: 'Description 2',
           created_at: new Date(),
           updated_at: new Date(),
           status: 'completed',
           start_date: new Date(),
           end_date: new Date(),
           project: new OkrProjects(),
        }
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockObjectives);

      const result = await service.findAll(projectId);

      expect(result).toEqual(mockObjectives);
    });
  });

  describe('findOne', () => {
    it('should find one objective by ID', async () => {
      const id = 1;
      const mockObjective: Objectives = {
        id: 1,
        project_id: 1,
        objective_name: 'Objective 1',
        description: 'Description 1',
        created_at: new Date(),
        updated_at: new Date(),
        status: 'progress',
        start_date: new Date(),
        end_date: new Date(),
        project: new OkrProjects(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockObjective);

      const result = await service.findOne(id);

      expect(result).toEqual(mockObjective);
    });
  });

  describe('update', () => {
    it('should update an objective', async () => {
      const id = 1;
      const updateObjectiveDto: UpdateObjectiveDto = {
        description: 'Updated Description 1',
      };
      const updatedObjective: Objectives = {
        id: 1,
        project_id: 1,
        objective_name: 'Objective 1',
        description: 'Updated Description 1',
        created_at: new Date(),
        updated_at: new Date(),
        status: 'progress',
        start_date: new Date(),
        end_date: new Date(),
        project: new OkrProjects(),
      };

      jest.spyOn(repository, 'preload').mockResolvedValue(updatedObjective);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedObjective);

      const result = await service.update(id, updateObjectiveDto);

      expect(result).toEqual(updatedObjective);
    });
  });

  describe('remove', () => {
    it('should remove an objective', async () => {
      const id = 1;
      const mockObjective: Objectives = {
        id: 1,
        project_id: 1,
        objective_name: 'Objective 1',
        description: 'Description 1',
        created_at: new Date(),
        updated_at: new Date(),
        status: 'progress',
        start_date: new Date(),
        end_date: new Date(),
        project: new OkrProjects(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockObjective);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockObjective);

      const result = await service.remove(id);

      expect(result).toEqual(mockObjective);
    });
  });
});
