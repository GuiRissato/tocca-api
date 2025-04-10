import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
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

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe( 'generateOkrProgress' , () => {
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
          due_date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
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
          due_date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
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
      jest.spyOn(objectivesService, 'findAll').mockImplementation(async (projectId: number) => {
        return mockObjectives.filter(obj => obj.project_id === projectId);
      });
      jest.spyOn(keyResultsService, 'findAll').mockResolvedValue(mockKeyResults);jest.spyOn(keyResultsService, 'findAll').mockImplementation(async (objectiveId: number) => {
        return mockKeyResults.filter(kr => kr.objective_id === objectiveId);
      });
      jest.spyOn(tasksService, 'findAll').mockImplementation(async (keyResultId: number) => {
        return mockTasks.filter(task => task.key_result_id === keyResultId);
      });
      jest.spyOn(columnsKeyResultService, 'findAll').mockResolvedValue(mockColumnsKeyResults);

      const projectId = 1;
      const year = 2024;

      const result = await service.generateOkrProgress(projectId, year);


      expect(result).toEqual({
        projectId: 1,
        projectName: 'Project 1',
        objectives: [
          { objectiveName: 'Objective 1', progress: 33.33 },
          { objectiveName: 'Objective 2', progress: 40 },
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

    it('should throw error when project is not found', async () => {
      jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(null);

      const projectId = 999;
      const year = 2024;

      await expect(service.generateOkrProgress(projectId, year))
        .rejects
        .toThrow('Projeto não encontrado!');
    });

    it('should throw error when OkrProjectsService.findOne fails', async () => {
      jest.spyOn(okrProjectsService, 'findOne').mockRejectedValue(new Error('Projeto não encontrado!'));

      const projectId = 1;
      const year = 2024;

      await expect(service.generateOkrProgress(projectId, year))
        .rejects
        .toThrow('Projeto não encontrado!');
    });

    it('should throw error when ObjectivesService.findAll fails', async () => {
      const mockOkrProject = {
        id: 1,
        project_name: 'Project 1',
        company_id: 1,
        description: '',
        created_at: new Date(),
        updated_at: new Date(),
        company: null
      };

      jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(mockOkrProject);
      jest.spyOn(objectivesService, 'findAll').mockRejectedValue(new Error('error finding objective'));

      const projectId = 1;
      const year = 2024;

      await expect(service.generateOkrProgress(projectId, year))
        .rejects
        .toThrow('error finding objective');
    });

    it('should throw error when KeyResultsService.findAll fails', async () => {
      const mockOkrProject = {
        id: 1,
        project_name: 'Project 1',
        company_id: 1,
        description: '',
        created_at: new Date(),
        updated_at: new Date(),
        company: null
      };

      const mockObjectives = [{
        id: 1,
        objective_name: 'Objective 1',
        project_id: 1,
        description: '',
        status: '',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        project: mockOkrProject
      }];

      jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(mockOkrProject);
      jest.spyOn(objectivesService, 'findAll').mockResolvedValue(mockObjectives);
      jest.spyOn(keyResultsService, 'findAll').mockRejectedValue(new Error('error finding key result'));

      const projectId = 1;
      const year = 2024;

      await expect(service.generateOkrProgress(projectId, year))
        .rejects
        .toThrow('error finding key result');
    });

    it('should throw error when TasksService.findAll fails', async () => {
      const mockOkrProject = {
        id: 1,
        project_name: 'Project 1',
        company_id: 1,
        description: '',
        created_at: new Date(),
        updated_at: new Date(),
        company: null
      };

      const mockObjectives = [{
        id: 1,
        objective_name: 'Objective 1',
        project_id: 1,
        description: '',
        status: '',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        project: mockOkrProject
      }];

      const mockKeyResults = [{
        id: 1,
        key_result_name: 'Key Result 1',
        objective_id: 1,
        description: '',
        status: '',
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        objective: mockObjectives[0]
      }];

      jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(mockOkrProject);
      jest.spyOn(objectivesService, 'findAll').mockResolvedValue(mockObjectives);
      jest.spyOn(keyResultsService, 'findAll').mockResolvedValue(mockKeyResults);
      jest.spyOn(tasksService, 'findAll').mockRejectedValue(new Error('error finding tasks'));

      const projectId = 1;
      const year = 2024;

      await expect(service.generateOkrProgress(projectId, year))
        .rejects
        .toThrow('error finding tasks');
    });

  })

  describe( 'generatePdfTaskPerformance' , () =>{
    it('should generate task performance PDF data successfully', async () => {
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
          column_key_result_id: 1,
          keyResultId: mockKeyResults[0],
          description: 'Descrição da Task 1',
          delay_reason: 'Complexidade técnica maior que o esperado',
          priority: 1, // alta prioridade
          due_date: new Date('2024-01-15'), // Atrasada
          columnKeyResultId: mockColumnsKeyResults[0],
          created_at: new Date('2024-01-01'),
          updated_at: new Date(),
        },
        {
          id: 2,
          key_result_id: 1,
          task_name: 'Task 2',
          column_key_result_id: 2,
          keyResultId: mockKeyResults[0],
          description: 'Descrição da Task 2',
          delay_reason: 'Dependência de terceiros',
          priority: 2, // média prioridade
          due_date: new Date('2024-01-20'), // Atrasada
          columnKeyResultId: mockColumnsKeyResults[1],
          created_at: new Date('2024-01-01'),
          updated_at: new Date(),
        },
        {
          id: 3,
          key_result_id: 1,
          task_name: 'Task 3',
          column_key_result_id: 5,
          keyResultId: mockKeyResults[0],
          description: 'Descrição da Task 3',
          delay_reason: '',
          priority: 3,
          due_date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // Futura
          columnKeyResultId: mockColumnsKeyResults[4],
          created_at: new Date('2024-01-01'),
          updated_at: new Date(),
        },
        // ... resto das tarefas com datas futuras
        {
          id: 4,
          key_result_id: 2,
          task_name: 'Task 4',
          column_key_result_id: 6,
          keyResultId: mockKeyResults[1],
          description: 'Descrição da Task 4',
          delay_reason: '',
          priority: 1,
          due_date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // Futura
          columnKeyResultId: mockColumnsKeyResults[5],
          created_at: new Date('2024-01-01'),
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
          due_date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
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
          due_date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
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
          due_date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
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
          due_date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
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
          due_date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
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
          due_date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
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
          due_date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
          columnKeyResultId: mockColumnsKeyResults[19], // Índice 19 corresponde à coluna com id 20
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      jest.spyOn(companiesService, 'findOne').mockResolvedValue(mockCompany);
      jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(mockOkrProject);
      jest.spyOn(objectivesService, 'findAll').mockImplementation(async (projectId: number) => {
        return mockObjectives.filter(obj => obj.project_id === projectId);
      });
      jest.spyOn(keyResultsService, 'findAll').mockResolvedValue(mockKeyResults);jest.spyOn(keyResultsService, 'findAll').mockImplementation(async (objectiveId: number) => {
        return mockKeyResults.filter(kr => kr.objective_id === objectiveId);
      });
      jest.spyOn(tasksService, 'findAll').mockImplementation(async (keyResultId: number) => {
        return mockTasks.filter(task => task.key_result_id === keyResultId);
      });
      jest.spyOn(columnsKeyResultService, 'findAll').mockResolvedValue(mockColumnsKeyResults);
      const result = await service.generatePdfTaskPerformance(1, new Date().getFullYear());

      // Expected result structure
      expect(result).toBeDefined()
      expect(result.projectId).toBe(1)
      expect(result.projectName).toBe('Project 1')
      expect(result.performanceByObjective).toHaveLength(mockObjectives.length);

      result.performanceByObjective.forEach((objective, index) => {
        expect(objective.objectiveName).toBe(mockObjectives[index].objective_name);
        expect(objective.columns).toHaveLength(3);
      });

      expect(result.delayedTasks).toBeDefined();
      expect(result.delayedTasks.totalDelayedTasks).toBe(2);
      expect(result.delayedTasks.delayedTasksByPriority.high).toBe(1);
      expect(result.delayedTasks.delayedTasksByPriority.medium).toBe(1);
      expect(result.delayedTasks.delayedTasksByPriority.low).toBe(0);

      expect(result.delayedTasks.delayReasons).toHaveLength(2);
      expect(result.delayedTasks.delayReasons[1].reason).toBe('Dependência de terceiros');
      expect(result.delayedTasks.delayReasons[0].tasks).toHaveLength(1);
    });

    it('should throw an error when project is not found', async () => {
      jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(null);
  
      const projectId = 999; // Non-existent project ID
      const year = 2024;
  
      await expect(service.generatePdfTaskPerformance(projectId, year))
        .rejects
        .toThrow('Projeto não encontrado!');
    });
  
    it('should throw an error when OkrProjectsService.findOne fails', async () => {
      jest.spyOn(okrProjectsService, 'findOne').mockRejectedValue(new Error('Error fetching project'));
  
      const projectId = 1;
      const year = 2024;
  
      await expect(service.generatePdfTaskPerformance(projectId, year))
        .rejects
        .toThrow('Error fetching project');
    });
  
    it('should throw an error when ObjectivesService.findAll fails', async () => {

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

      jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(mockOkrProject);
      jest.spyOn(objectivesService, 'findAll').mockRejectedValue(new Error('Error fetching objectives'));
  
      const projectId = 1;
      const year = 2024;
  
      await expect(service.generatePdfTaskPerformance(projectId, year))
        .rejects
        .toThrow('Error fetching objectives');
    });
  
    it('should throw an error when KeyResultsService.findAll fails', async () => {

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
      jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(mockOkrProject);
      jest.spyOn(objectivesService, 'findAll').mockResolvedValue(mockObjectives);
      jest.spyOn(keyResultsService, 'findAll').mockRejectedValue(new Error('Error fetching key results'));
  
      const projectId = 1;
      const year = 2024;
  
      await expect(service.generatePdfTaskPerformance(projectId, year))
        .rejects
        .toThrow('Error fetching key results');
    });
  
    it('should throw an error when TasksService.findAll fails', async () => {
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

      jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(mockOkrProject);
      jest.spyOn(objectivesService, 'findAll').mockResolvedValue(mockObjectives);
      jest.spyOn(keyResultsService, 'findAll').mockImplementation(async (objectiveId: number) => {
        return mockKeyResults.filter(kr => kr.objective_id === objectiveId);
      });
      jest.spyOn(tasksService, 'findAll').mockRejectedValue(new Error('Error fetching tasks'));
  
      const projectId = 1;
      const year = 2024;
  
      await expect(service.generatePdfTaskPerformance(projectId, year))
        .rejects
        .toThrow('Error fetching tasks');
    });

  })

  describe('generatePdfDeadLines', () => {
    it('should generate PDF deadlines data successfully', async () => {
      // Mock data
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
        project_name: 'Project Alpha',
        description: '',
        created_at: new Date(),
        updated_at: new Date(),
        company: mockCompany,
      };

      const mockObjectives: Objectives[] = [
        {
          id: 1,
          objective_name: 'Increase market share',
          project_id: 1,
          project: mockOkrProject,
          description: '',
          status: '',
          start_date: new Date('2024-01-01'),
          end_date: new Date('2024-12-31'),
          created_at: new Date('2024-01-15'),
          updated_at: new Date(),
        },
        {
          id: 2,
          objective_name: 'Improve customer satisfaction',
          project_id: 1,
          project: mockOkrProject,
          description: '',
          status: '',
          start_date: new Date('2024-02-01'),
          end_date: new Date('2024-12-31'),
          created_at: new Date('2024-02-10'),
          updated_at: new Date(),
        },
      ];

      const mockKeyResults: KeyResults[] = [
        {
          id: 1,
          key_result_name: 'Launch new product',
          objective_id: 1,
          objective: mockObjectives[0],
          description: '',
          status: '',
          start_date: new Date('2024-01-15'),
          end_date: new Date('2024-06-30'),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          key_result_name: 'Enhance support services',
          objective_id: 2,
          objective: mockObjectives[1],
          description: '',
          status: '',
          start_date: new Date('2024-02-15'),
          end_date: new Date('2024-12-31'),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

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
          column_name: 'Finalizadas',
          key_result_id: 1,
          keyResult: mockKeyResults[0],
          position: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Repeat for key result 2
        {
          id: 4,
          column_name: 'Para Fazer',
          key_result_id: 2,
          keyResult: mockKeyResults[1],
          position: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 5,
          column_name: 'Em Progresso',
          key_result_id: 2,
          keyResult: mockKeyResults[1],
          position: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 6,
          column_name: 'Finalizadas',
          key_result_id: 2,
          keyResult: mockKeyResults[1],
          position: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      const mockTasks: Tasks[] = [
        // Tasks for Key Result 1
        {
          id: 1,
          key_result_id: 1,
          task_name: 'Design product',
          description: 'Design the new product',
          delay_reason: '',
          priority: 1,
          due_date: new Date('2024-03-01'),
          column_key_result_id: 3, // 'Finalizadas'
          columnKeyResultId: mockColumnsKeyResults[2],
          keyResultId: mockKeyResults[0],
          created_at: new Date('2024-01-20'),
          updated_at: new Date(),
        },
        {
          id: 2,
          key_result_id: 1,
          task_name: 'Develop product',
          description: 'Develop the new product',
          delay_reason: '',
          priority: 2,
          due_date: new Date('2024-05-15'),
          column_key_result_id: 2, // 'Em Progresso'
          columnKeyResultId: mockColumnsKeyResults[1],
          keyResultId: mockKeyResults[0],
          created_at: new Date('2024-03-02'),
          updated_at: new Date(),
        },
        {
          id: 3,
          key_result_id: 1,
          task_name: 'Market product',
          description: 'Market the new product',
          delay_reason: '',
          priority: 3,
          due_date: new Date('2024-06-30'),
          column_key_result_id: 1, // 'Para Fazer'
          columnKeyResultId: mockColumnsKeyResults[0],
          keyResultId: mockKeyResults[0],
          created_at: new Date('2024-05-16'),
          updated_at: new Date(),
        },
        // Tasks for Key Result 2
        {
          id: 4,
          key_result_id: 2,
          task_name: 'Implement live chat',
          description: 'Add live chat support',
          delay_reason: '',
          priority: 1,
          due_date: new Date('2024-08-01'),
          column_key_result_id: 6, // 'Finalizadas'
          columnKeyResultId: mockColumnsKeyResults[5],
          keyResultId: mockKeyResults[1],
          created_at: new Date('2024-06-01'),
          updated_at: new Date(),
        },
        {
          id: 5,
          key_result_id: 2,
          task_name: 'Extend support hours',
          description: 'Extend customer support hours',
          delay_reason: '',
          priority: 2,
          due_date: new Date('2024-09-15'),
          column_key_result_id: 6, // 'Finalizadas'
          columnKeyResultId: mockColumnsKeyResults[5],
          keyResultId: mockKeyResults[1],
          created_at: new Date('2024-07-15'),
          updated_at: new Date(),
        },
        {
          id: 6,
          key_result_id: 2,
          task_name: 'Introduce feedback surveys',
          description: 'Implement customer feedback surveys',
          delay_reason: '',
          priority: 3,
          due_date: new Date('2024-10-31'),
          column_key_result_id: 5, // 'Em Progresso'
          columnKeyResultId: mockColumnsKeyResults[4],
          keyResultId: mockKeyResults[1],
          created_at: new Date('2024-09-16'),
          updated_at: new Date(),
        },
      ];

      // Mock implementations
      jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(mockOkrProject);
      jest.spyOn(objectivesService, 'findAll').mockImplementation(async (projectId: number) => {
        return mockObjectives.filter(obj => obj.project_id === projectId);
      });
      jest.spyOn(keyResultsService, 'findAll').mockImplementation(async (objectiveId: number) => {
        return mockKeyResults.filter(kr => kr.objective_id === objectiveId);
      });
      jest.spyOn(tasksService, 'findAll').mockImplementation(async (keyResultId: number) => {
        return mockTasks.filter(task => task.key_result_id === keyResultId);
      });
      jest.spyOn(columnsKeyResultService, 'findAll').mockImplementation(async (columnId: number) => {
        return mockColumnsKeyResults.filter(column => column.id === columnId);
      });

      const projectId = 1;
      const year = 2024;

      const result = await service.generatePdfDeadLines(projectId, year);


      // Assertions
      expect(result).toBeDefined();
      expect(result.projectId).toBe(projectId);
      expect(result.projectName).toBe('Project Alpha');
      expect(result.objectives).toHaveLength(2);

      const objective1Data = result.objectives.find(obj => obj.objectiveName === 'Increase market share');
      const objective2Data = result.objectives.find(obj => obj.objectiveName === 'Improve customer satisfaction');

      // Objective 1 assertions
      expect(objective1Data).toBeDefined();
      expect(objective1Data.completionDate).toBe('2024-06-30');
      expect(objective1Data.completionPercentage).toBe(33);
      expect(objective1Data.keyResults).toHaveLength(1);
      expect(objective1Data.keyResults[0]).toEqual({
        name: 'Launch new product',
        dueDate: '2024-06-30',
      });

      // Objective 2 assertions
      expect(objective2Data).toBeDefined();
      expect(objective2Data.completionDate).toBe('2024-10-31');
      expect(objective2Data.completionPercentage).toBe(67);
      expect(objective2Data.keyResults).toHaveLength(1);
      expect(objective2Data.keyResults[0]).toEqual({
        name: 'Enhance support services',
        dueDate: '2024-12-31',
      });
    });

    // Error scenarios
    it('should throw an error when project is not found', async () => {
      jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(null);

      const projectId = 999; // Non-existent project ID
      const year = 2024;

      await expect(service.generatePdfDeadLines(projectId, year))
        .rejects
        .toThrow('Projeto não encontrado!');
    });

    it('should throw an error when OkrProjectsService.findOne fails', async () => {
      jest.spyOn(okrProjectsService, 'findOne').mockRejectedValue(new Error('Error fetching project'));

      const projectId = 1;
      const year = 2024;

      await expect(service.generatePdfDeadLines(projectId, year))
        .rejects
        .toThrow('Error fetching project');
    });

    it('should handle case when no objectives are found', async () => {

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
        project_name: 'Project Alpha',
        description: '',
        created_at: new Date(),
        updated_at: new Date(),
        company: mockCompany,
      };

      jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(mockOkrProject);
      jest.spyOn(objectivesService, 'findAll').mockResolvedValue([]); // No objectives

      const projectId = 1;
      const year = 2024;

      const result = await service.generatePdfDeadLines(projectId, year);

      expect(result).toBeDefined();
      expect(result.objectives).toHaveLength(0);
    });

    it('should handle case when objectives have no key results', async () => {

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
        project_name: 'Project Alpha',
        description: '',
        created_at: new Date(),
        updated_at: new Date(),
        company: mockCompany,
      };

      const mockObjectives: Objectives[] = [
        {
          id: 1,
          objective_name: 'Increase market share',
          project_id: 1,
          project: mockOkrProject,
          description: '',
          status: '',
          start_date: new Date('2024-01-01'),
          end_date: new Date('2024-12-31'),
          created_at: new Date('2024-01-15'),
          updated_at: new Date(),
        },
        {
          id: 2,
          objective_name: 'Improve customer satisfaction',
          project_id: 1,
          project: mockOkrProject,
          description: '',
          status: '',
          start_date: new Date('2024-02-01'),
          end_date: new Date('2024-12-31'),
          created_at: new Date('2024-02-10'),
          updated_at: new Date(),
        },
      ];
      jest.spyOn(okrProjectsService, 'findOne').mockResolvedValue(mockOkrProject);
      jest.spyOn(objectivesService, 'findAll').mockResolvedValue(mockObjectives);
      jest.spyOn(keyResultsService, 'findAll').mockResolvedValue([]); // No key results
      jest.spyOn(tasksService, 'findAll').mockResolvedValue([]);

      const projectId = 1;
      const year = 2024;

      const result = await service.generatePdfDeadLines(projectId, year);

      expect(result).toBeDefined();
      expect(result.objectives).toHaveLength(mockObjectives.length);
      result.objectives.forEach(obj => {
        expect(obj.keyResults).toHaveLength(0);
        expect(obj.completionDate).toBeNull();
        expect(obj.completionPercentage).toBe(0);
      });
    });
  });

});