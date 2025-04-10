import { Test, TestingModule } from '@nestjs/testing';
import { OkrProjectsService } from './okr_projects.service';
import { Repository } from 'typeorm';
import { CreateOkrProjectDto } from './dto/create-okr_project.dto';
import { UpdateOkrProjectDto } from './dto/update-okr_project.dto';
import { OkrProjects } from './entities/okr_project.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Companies } from '../companies/entities/company.entity';

describe('OkrProjectsService', () => {
  let service: OkrProjectsService;
  let repository: Repository<OkrProjects>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OkrProjectsService,
        {
          provide: getRepositoryToken(OkrProjects),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OkrProjectsService>(OkrProjectsService);
    repository = module.get<Repository<OkrProjects>>(
      getRepositoryToken(OkrProjects),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an OKR project', async () => {
    const createDto: CreateOkrProjectDto = {
      company_id: 0,
      project_name: '',
      description: '',
    };
    const createdOkrProject: OkrProjects = {
      id: 1,
      company_id: 0,
      project_name: 'projeto 1',
      description: 'sem descrição',
      created_at: new Date(),
      updated_at: new Date(),
      company: new Companies(),
    };

    jest.spyOn(repository, 'create').mockReturnValue(createdOkrProject);
    jest.spyOn(repository, 'save').mockResolvedValue(createdOkrProject);

    const result = await service.create(createDto);

    expect(result).toEqual(createdOkrProject);
  });

  it('should find all OKR projects by company ID', async () => {
    const companyId = 1;
    const mockOkrProjects: OkrProjects[] = [
      {
        id: 1,
        company_id: companyId,
        project_name: 'Project 1',
        description: 'project 1',
        created_at: new Date(),
        updated_at: new Date(),
        company: new Companies(),
      },
      {
        id: 2,
        company_id: companyId,
        project_name: 'Project 2',
        description: 'project 2',
        created_at: new Date(),
        updated_at: new Date(),
        company: new Companies(),
      },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(mockOkrProjects);

    const result = await service.findAll(companyId);

    expect(result).toEqual(mockOkrProjects);
  });

  it('should find one OKR project by ID', async () => {
    const id = 1;
    const companyId = 1;
    const mockOkrProject: OkrProjects = {
      id: 1,
      company_id: companyId,
      project_name: 'Project 1',
      description: 'project 1',
      created_at: new Date(),
      updated_at: new Date(),
      company: new Companies(),
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(mockOkrProject);

    const result = await service.findOne(id);

    expect(result).toEqual(mockOkrProject);
  });

  it('should update an OKR project', async () => {
    const id = 1;
    const updateDto: UpdateOkrProjectDto = {
      description: 'teste 1',
    };
    const updatedOkrProject: OkrProjects = {
      id: 1,
      company_id: 1,
      project_name: 'Updated Project 1',
      description: '',
      created_at: new Date(),
      updated_at: new Date(),
      company: new Companies(),
    };

    jest.spyOn(repository, 'preload').mockResolvedValue(updatedOkrProject);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedOkrProject);

    const result = await service.update(id, updateDto);

    expect(result).toEqual(updatedOkrProject);
  });

  it('should remove an OKR project', async () => {
    const id = 1; // Example OKR project ID
    const companyId = 1;
    const mockOkrProject: OkrProjects = {
      id: 1,
      company_id: companyId,
      project_name: 'Project 1',
      description: 'project 1',
      created_at: new Date(),
      updated_at: new Date(),
      company: new Companies(),
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(mockOkrProject);
    jest.spyOn(repository, 'remove').mockResolvedValue(mockOkrProject);

    const result = await service.remove(id);

    expect(result).toEqual(mockOkrProject);
  });
  it('should return distinct years of registration for a given company', async () => {
    const companyId = 1;
    const mockQueryResult = [{ year: '2021' }, { year: '2022' }];

    const createQueryBuilder: any = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(mockQueryResult),
    };
    jest
      .spyOn(repository, 'createQueryBuilder')
      .mockImplementation(() => createQueryBuilder);

    const result = await service.findAllDistinctYearsByCompany(companyId);
    expect(result).toEqual([2021, 2022]);
    expect(createQueryBuilder.select).toHaveBeenCalledWith(
      "DISTINCT EXTRACT(YEAR FROM okr_project.created_at)",
      'year',
    );
    expect(createQueryBuilder.where).toHaveBeenCalledWith(
      'okr_project.company_id = :companyId',
      { companyId },
    );
  });
});
