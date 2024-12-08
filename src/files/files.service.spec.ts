import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { OkrProgress } from './interfaces/interfaces.files';
import { KeyResults } from '../key_results/entities/key_result.entity';
import { OkrProjects } from '../okr_projects/entities/okr_project.entity';
import { Objectives } from '../objectives/entities/objective.entity';
import { Tasks } from '../tasks/entities/task.entity';
import { Companies } from '../companies/entities/company.entity';
import { ColumnsKeyResults } from '../columns_key_result/entities/columns_key_result.entity';
import { OkrProjectsService } from '../okr_projects/okr_projects.service';
import { ObjectivesService } from '../objectives/objectives.service';
import { KeyResultsService } from '../key_results/key_results.service';
import { TasksService } from '../tasks/tasks.service';
import { ColumnsKeyResultService } from '../columns_key_result/columns_key_result.service';
import { CompaniesService } from '../companies/company.service';

describe('FilesService', () => {
  let service: FilesService;
  let okrProjectsService: OkrProjectsService;
  let objectivesService: ObjectivesService;
  let keyResultsService: KeyResultsService;
  let tasksService: TasksService;
  let columnsKeyResultService: ColumnsKeyResultService;
  let companiesService: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: OkrProjectsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ObjectivesService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: KeyResultsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: TasksService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: ColumnsKeyResultService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: CompaniesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    okrProjectsService = module.get<OkrProjectsService>(OkrProjectsService);
    objectivesService = module.get<ObjectivesService>(ObjectivesService);
    keyResultsService = module.get<KeyResultsService>(KeyResultsService);
    tasksService = module.get<TasksService>(TasksService);
    columnsKeyResultService = module.get<ColumnsKeyResultService>(ColumnsKeyResultService);
    companiesService = module.get<CompaniesService>(CompaniesService);
  });

  it('should generateOkrProgress with mock data', async () => {
    // Mocks de dados
    const mockCompany: Companies = {
      id: 1,
      company_name: 'Company 1',
      description: 'Description 1',
      created_at: new Date(),
      updated_at: new Date(),
    };

    const mockOkrProject: OkrProjects = {
      id: 1,
      company_id: 1,
      project_name: 'Project 1',
      description: '',
      created_at: new Date(),
      updated_at: new Date(),
      company: mockCompany,
    };

    const mockObjectives: Objectives[] = [
      {
        id: 1,
        objective_name: 'Objective 1',
        project_id: 1,
        project: mockOkrProject,
        description: '',
        status: '',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        objective_name: 'Objective 2',
        project_id: 1,
        project: mockOkrProject,
        description: '',
        status: '',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const mockKeyResults: KeyResults[] = [
      {
        id: 1,
        key_result_name: 'Key Result 1',
        objective_id: 1,
        objective: mockObjectives[0],
        description: '',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        status: ''
      },
      {
        id: 2,
        key_result_name: 'Key Result 1',
        objective_id: 2,
        status: '',
        objective: mockObjectives[1],
        description: '',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        key_result_name: 'Key Result 2',
        objective_id: 1,
        objective: mockObjectives[0],
        description: '',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        status: ''
      },
      {
        id: 4,
        key_result_name: 'Key Result 2',
        objective_id: 2,
        status: '',
        objective: mockObjectives[1],
        description: '',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const mockColumnsKeyResults: ColumnsKeyResults[] = [
      {
        id: 1,
        column_name: 'Para Fazer',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 1,
        keyResult: mockKeyResults[0],
        position: 0
      },
      {
        id: 2,
        column_name: 'Pendente',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 1,
        keyResult: mockKeyResults[0],
        position: 1
      },
      {
        id: 3,
        column_name: 'Em Progresso',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 1,
        keyResult: mockKeyResults[0],
        position: 2
      },
      {
        id: 4,
        column_name: 'Finalizado',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 1,
        keyResult: mockKeyResults[0],
        position: 3
      },
      {
        id: 5,
        column_name: 'Fechado',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 1,
        keyResult: mockKeyResults[0],
        position: 4
      },
      {
        id: 6,
        column_name: 'Para Fazer',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 2,
        keyResult: mockKeyResults[1],
        position: 0
      },
      {
        id: 7,
        column_name: 'Pendente',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 2,
        keyResult: mockKeyResults[1],
        position: 1
      },
      {
        id: 8,
        column_name: 'Em Progresso',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 2,
        keyResult: mockKeyResults[1],
        position: 2
      },
      {
        id: 9,
        column_name: 'Finalizado',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 2,
        keyResult: mockKeyResults[1],
        position: 3
      },
      {
        id: 10,
        column_name: 'Fechado',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 2,
        keyResult: mockKeyResults[1],
        position: 4
      },

      {
        id: 11,
        column_name: 'Para Fazer',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 3,
        keyResult: mockKeyResults[2],
        position: 0
      },
      {
        id: 12,
        column_name: 'Pendente',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 3,
        keyResult: mockKeyResults[2],
        position: 1
      },
      {
        id: 13,
        column_name: 'Em Progresso',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 3,
        keyResult: mockKeyResults[2],
        position: 2
      },
      {
        id: 14,
        column_name: 'Finalizado',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 3,
        keyResult: mockKeyResults[2],
        position: 3
      },
      {
        id: 15,
        column_name: 'Fechado',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 3,
        keyResult: mockKeyResults[2],
        position: 4
      },
      {
        id: 16,
        column_name: 'Para Fazer',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 4,
        keyResult: mockKeyResults[3],
        position: 0
      },
      {
        id: 17,
        column_name: 'Pendente',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 4,
        keyResult: mockKeyResults[3],
        position: 1
      },
      {
        id: 18,
        column_name: 'Em Progresso',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 4,
        keyResult: mockKeyResults[3],
        position: 2
      },
      {
        id: 19,
        column_name: 'Finalizado',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 4,
        keyResult: mockKeyResults[3],
        position: 3
      },
      {
        id: 20,
        column_name: 'Fechado',
        created_at: new Date(),
        updated_at: new Date(),
        key_result_id: 4,
        keyResult: mockKeyResults[3],
        position: 4
      },
    ];

    const mockTasks: Tasks[] = [
      // Tarefas para Key Result 1
      {
        id: 1,
        key_result_id: 1,
        task_name: 'Task 1',
        column_key_result_id: 1, // 'Para Fazer' do Key Result 1
        keyResultId: mockKeyResults[0],
        description: 'Descrição da Task 1',
        delay_reason: '',
        priority: 1,
        due_date: new Date(),
        columnKeyResultId: mockColumnsKeyResults[0], // Índice 0 corresponde à coluna com id 1
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        key_result_id: 1,
        task_name: 'Task 2',
        column_key_result_id: 2, // 'Pendente' do Key Result 1
        keyResultId: mockKeyResults[0],
        description: 'Descrição da Task 2',
        delay_reason: '',
        priority: 2,
        due_date: new Date(),
        columnKeyResultId: mockColumnsKeyResults[1], // Índice 1 corresponde à coluna com id 2
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        key_result_id: 1,
        task_name: 'Task 3',
        column_key_result_id: 5, // 'Fechado' do Key Result 1
        keyResultId: mockKeyResults[0],
        description: 'Descrição da Task 3',
        delay_reason: '',
        priority: 3,
        due_date: new Date(),
        columnKeyResultId: mockColumnsKeyResults[4], // Índice 4 corresponde à coluna com id 5
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Tarefas para Key Result 2
      {
        id: 4,
        key_result_id: 2,
        task_name: 'Task 4',
        column_key_result_id: 6, // 'Para Fazer' do Key Result 2
        keyResultId: mockKeyResults[1],
        description: 'Descrição da Task 4',
        delay_reason: '',
        priority: 1,
        due_date: new Date(),
        columnKeyResultId: mockColumnsKeyResults[5], // Índice 5 corresponde à coluna com id 6
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        key_result_id: 2,
        task_name: 'Task 5',
        column_key_result_id: 10, // 'Fechado' do Key Result 2
        keyResultId: mockKeyResults[1],
        description: 'Descrição da Task 5',
        delay_reason: '',
        priority: 2,
        due_date: new Date(),
        columnKeyResultId: mockColumnsKeyResults[9], // Índice 9 corresponde à coluna com id 10
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Tarefas para Key Result 3
      {
        id: 6,
        key_result_id: 3,
        task_name: 'Task 6',
        column_key_result_id: 11, // 'Para Fazer' do Key Result 3
        keyResultId: mockKeyResults[2],
        description: 'Descrição da Task 6',
        delay_reason: '',
        priority: 1,
        due_date: new Date(),
        columnKeyResultId: mockColumnsKeyResults[10], // Índice 10 corresponde à coluna com id 11
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        key_result_id: 3,
        task_name: 'Task 7',
        column_key_result_id: 13, // 'Em Progresso' do Key Result 3
        keyResultId: mockKeyResults[2],
        description: 'Descrição da Task 7',
        delay_reason: '',
        priority: 2,
        due_date: new Date(),
        columnKeyResultId: mockColumnsKeyResults[12], // Índice 12 corresponde à coluna com id 13
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        key_result_id: 3,
        task_name: 'Task 8',
        column_key_result_id: 15, // 'Fechado' do Key Result 3
        keyResultId: mockKeyResults[2],
        description: 'Descrição da Task 8',
        delay_reason: '',
        priority: 3,
        due_date: new Date(),
        columnKeyResultId: mockColumnsKeyResults[14], // Índice 14 corresponde à coluna com id 15
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Tarefas para Key Result 4
      {
        id: 9,
        key_result_id: 4,
        task_name: 'Task 9',
        column_key_result_id: 16, // 'Para Fazer' do Key Result 4
        keyResultId: mockKeyResults[3],
        description: 'Descrição da Task 9',
        delay_reason: '',
        priority: 1,
        due_date: new Date(),
        columnKeyResultId: mockColumnsKeyResults[15], // Índice 15 corresponde à coluna com id 16
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 10,
        key_result_id: 4,
        task_name: 'Task 10',
        column_key_result_id: 18, // 'Em Progresso' do Key Result 4
        keyResultId: mockKeyResults[3],
        description: 'Descrição da Task 10',
        delay_reason: '',
        priority: 2,
        due_date: new Date(),
        columnKeyResultId: mockColumnsKeyResults[17], // Índice 17 corresponde à coluna com id 18
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 11,
        key_result_id: 4,
        task_name: 'Task 11',
        column_key_result_id: 20, // 'Fechado' do Key Result 4
        keyResultId: mockKeyResults[3],
        description: 'Descrição da Task 11',
        delay_reason: '',
        priority: 3,
        due_date: new Date(),
        columnKeyResultId: mockColumnsKeyResults[19], // Índice 19 corresponde à coluna com id 20
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    jest.spyOn(companiesService, 'findOne').mockResolvedValue(mockCompany);
    jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(mockOkrProject);
    jest.spyOn(objectivesService, 'findAll').mockResolvedValue(mockObjectives);
    jest.spyOn(keyResultsService, 'findAll').mockResolvedValue(mockKeyResults);
    jest.spyOn(tasksService, 'findAll').mockResolvedValue(mockTasks);
    jest.spyOn(columnsKeyResultService, 'findAll').mockResolvedValue(mockColumnsKeyResults);

    const projectId = 1;
    const year = 2024;

    const result = await service.generateOkrProgress(projectId, year);


    expect(result).toEqual({
      projectId: 1,
      projectName: 'Project 1',
      objectives: [
        { objectiveName: 'Objective 1', progress: 36.36 },
        { objectiveName: 'Objective 2', progress: 36.36 },
      ],
      keyResults: [
        { columnName: 'Para Fazer', percentage: 36.36 },
        { columnName: 'Pendente', percentage: 9.09 },
        { columnName: 'Em Progresso', percentage: 18.18 },
        { columnName: 'Finalizado', percentage: 0 },
        { columnName: 'Fechado', percentage: 36.36 },
      ],
    });
  });
});