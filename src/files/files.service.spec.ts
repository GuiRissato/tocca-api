import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { OkrProgress } from './interfaces/interfaces.files';
import { Repository } from 'typeorm';
import { KeyResults } from '../key_results/entities/key_result.entity';
import { OkrProjects } from '../okr_projects/entities/okr_project.entity';
import { Objectives } from '../objectives/entities/objective.entity';
import { Tasks } from '../tasks/entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Companies } from '../companies/entities/company.entity';
import { ColumnsKeyResults } from '../columns_key_result/entities/columns_key_result.entity';

describe('FilesService', () => {
  let service: FilesService;
  let objectivesRepository: Repository<Objectives>;
  let okrProjectsRepository: Repository<OkrProjects>;
  let keyResultsRepository: Repository<KeyResults>;
  let tasksRepository: Repository<Tasks>;
  let companiesRepository: Repository<Companies>;
  let columnsKeyResultsRepository: Repository<ColumnsKeyResults>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: getRepositoryToken(Objectives),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OkrProjects),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(KeyResults),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tasks),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Companies),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(ColumnsKeyResults),
          useClass: Repository
        }
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    objectivesRepository = module.get<Repository<Objectives>>(getRepositoryToken(Objectives));
    okrProjectsRepository = module.get<Repository<OkrProjects>>(getRepositoryToken(OkrProjects));
    keyResultsRepository = module.get<Repository<KeyResults>>(getRepositoryToken(KeyResults));
    tasksRepository = module.get<Repository<Tasks>>(getRepositoryToken(Tasks));
    companiesRepository = module.get<Repository<Companies>>(getRepositoryToken(Companies));
    columnsKeyResultsRepository = module.get<Repository<ColumnsKeyResults>>(getRepositoryToken(ColumnsKeyResults));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generateOkrProgress with mock data', async () => {

    // criar o mock da companhia
    const mockCompany: Companies = {
      id: 1,
       company_name: 'Company 1',
       description: 'Description 1',
       created_at: new Date(),
       updated_at: new Date(),
    } 

    jest.spyOn(companiesRepository, 'findOne').mockResolvedValue(mockCompany);
    
    const okrProject: OkrProjects = {
      id: 1,
      company_id: 1,
      project_name: 'Project 1',
      description: '',
      created_at: new Date(),
      updated_at: new Date(),
      company: new Companies()
    };

    jest.spyOn(okrProjectsRepository, 'findOne').mockResolvedValue(okrProject);

    // Mockando objetivos
    const mockObjectives: Objectives[] = [
      {
        id: 1, objective_name: 'Objective 1',
        project_id: 1,
        project: okrProject,
        description: '',
        status: '',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2, objective_name: 'Objective 2',
        project_id: 1,
        project: okrProject,
        description: '',
        status: '',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
    ];
    jest.spyOn(objectivesRepository, 'createQueryBuilder').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockObjectives),
    } as any);

    // Mockando Key Results
    const mockKeyResults: KeyResults[] = [
      {
        id: 1, key_result_name: 'Key Result 1', objective_id: 1,
        objective: mockObjectives[0],
        description: '',
        status: '',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2, key_result_name: 'Key Result 2', objective_id: 2,
        objective: mockObjectives[0],
        description: '',
        status: '',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
    ];
    jest.spyOn(keyResultsRepository, 'createQueryBuilder').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockKeyResults),
    } as any);

        // Mockando Colunas
        const mockColumnsKeyResults: ColumnsKeyResults[] = [
          {
            id: 1,
            column_name: 'Para Fazer',
            key_result_id: 1,
            keyResult: mockKeyResults[0],
            position: 0,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 2,
            column_name: 'Em Progresso',
            key_result_id: 1,
            keyResult: mockKeyResults[0],
            position: 1,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 3,
            column_name: 'Finalizado',
            key_result_id: 1,
            keyResult: mockKeyResults[0],
            position: 2,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 4,
            column_name: 'Fechado',
            key_result_id: 1,
            keyResult: mockKeyResults[0],
            position: 3,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ];

    // Mockando Tasks
    const mockTasks: Tasks[] = [
      {
        id: 1,
        key_result_id: 1,
        task_name: 'Task 1',
        column_key_result_id: 1, // ID da coluna associada (Para Fazer)
        keyResultId: mockKeyResults[0],
        description: '',
        delay_reason: '',
        priority: 1,
        due_date: new Date(),
        columnKeyResultId: mockColumnsKeyResults[0], // Retire se não for necessário no contexto
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        key_result_id: 1,
        task_name: 'Task 2',
        column_key_result_id: 2, // ID da coluna associada (Em Progresso)
        keyResultId: mockKeyResults[0],
        description: '',
        delay_reason: '',
        priority: 1,
        due_date: new Date(),
        columnKeyResultId: mockColumnsKeyResults[1], // Retire se não for necessário no contexto
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    jest.spyOn(tasksRepository, 'createQueryBuilder').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockTasks),
    } as any);

    // Mockando progresso dos objetivos
    jest.spyOn(service, 'calculateObjectiveProgress')
      .mockResolvedValueOnce(50)
      .mockResolvedValueOnce(75);

    const projectId = 1;
    const year = 2024;

    const result = await service.generateOkrProgress( projectId, year);

    console.log('result'  , result)

    // Verificando os valores esperados
    expect(result).toEqual({
      projectId: 1,
      projectName: 'Project 1',
      objectives: [
        { objectiveName: 'Objective 1', progress: 50 },
        { objectiveName: 'Objective 2', progress: 75 },
      ],
      keyResults: [
        { columnName: 'Para Fazer', percentage: 50 },
        { columnName: 'Pendente', percentage: 0 },
        { columnName: 'Em Progresso', percentage: 50 },
        { columnName: 'Finalizado', percentage: 0 },
        { columnName: 'Fechado', percentage: 0 },
      ],
    });
  });
});

