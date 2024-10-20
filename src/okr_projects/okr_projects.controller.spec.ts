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
});
