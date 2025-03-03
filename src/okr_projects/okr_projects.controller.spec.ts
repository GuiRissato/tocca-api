import { Test, TestingModule } from '@nestjs/testing';
import { OkrProjectsController } from './okr_projects.controller';
import { OkrProjectsService } from './okr_projects.service';
import { CreateOkrProjectDto } from './dto/create-okr_project.dto';
import { UpdateOkrProjectDto } from './dto/update-okr_project.dto';

const mockOkrProjectsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findAllDistinctYearsByCompany: jest.fn(),
};

describe('OkrProjectsController', () => {
  let controller: OkrProjectsController;
  let service: OkrProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OkrProjectsController],
      providers: [
        {
          provide: OkrProjectsService,
          useValue: mockOkrProjectsService,
        },
      ],
    }).compile();

    controller = module.get<OkrProjectsController>(OkrProjectsController);
    service = module.get<OkrProjectsService>(OkrProjectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call okrprokects create with the correct values', async () => {
      const createOkrProkectDto: CreateOkrProjectDto = {
        company_id: 1,
        project_name: 'projeto 1',
        description: 'descrição 1',
      };

      const createdOkrProject = { id: 1, ...createOkrProkectDto };

      mockOkrProjectsService.create.mockResolvedValue(createdOkrProject);

      const result = await controller.create(createOkrProkectDto);

      expect(service.create).toHaveBeenCalledWith(createOkrProkectDto);
      expect(result).toEqual(createdOkrProject);
    });
  });

  describe('findAll', () => {
    it('should retunr all projects from a company id', async () => {
      const okrProjects: CreateOkrProjectDto[] = [
        {
          company_id: 1,
          project_name: 'projeto 1',
          description: 'descrição 1',
        },
        {
          company_id: 1,
          project_name: 'projeto 1',
          description: 'descrição 1',
        },
        {
          company_id: 1,
          project_name: 'projeto 1',
          description: 'descrição 1',
        },
      ];

      mockOkrProjectsService.findAll.mockResolvedValue(okrProjects);

      const result = await controller.findAll(1);

      expect(service.findAll).toHaveBeenCalledWith(1);
      expect(result).toEqual(okrProjects);
    });
  });

  describe('findOne', () => {
    it('should return a okr project by ID', async () => {
      const okrProject: CreateOkrProjectDto = {
        company_id: 1,
        project_name: 'projeto 1',
        description: 'descrição 1',
      };

      mockOkrProjectsService.findOne.mockResolvedValue(okrProject);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(okrProject);
    });
  });

  describe('update', () => {
    it('should call okrProject update with the correct values', async () => {
      const updateOkrProjectDto: UpdateOkrProjectDto = {
        company_id: 1,
        description: 'changed description',
      };

      mockOkrProjectsService.update.mockResolvedValue(updateOkrProjectDto);

      const result = await controller.update(1, updateOkrProjectDto);

      expect(service.update).toHaveBeenCalledWith(1, updateOkrProjectDto);
      expect(result).toEqual(updateOkrProjectDto);
    });
  });

  describe('remove', () => {
    it('should call okrproject remove with the correct id', async () => {
      const removedOkrProject: CreateOkrProjectDto = {
        project_name: 'project1',
        description: 'description 1',
        company_id: 1,
      };

      mockOkrProjectsService.remove.mockResolvedValue(removedOkrProject);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(removedOkrProject);
    });
  });
  describe('findAllYears', () => {
    it('should return distinct years for a given company', async () => {
      const mockYears = [2021, 2022];
      mockOkrProjectsService.findAllDistinctYearsByCompany.mockResolvedValue(mockYears);

      const result = await controller.findAllYears(1);
      expect(service.findAllDistinctYearsByCompany).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockYears);
    });
  });
});
