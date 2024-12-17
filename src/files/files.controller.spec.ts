import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

const mockFilesService = {
  generateOkrProgress: jest.fn(),
  generatePdfTaskPerformance: jest.fn(),
  generatePdfDeadLines: jest.fn(),
};

describe('FilesController', () => {
  let controller: FilesController;
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers:[
        {
          provide: FilesService,
          useValue: mockFilesService,
        }
      ]
    }).compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get<FilesService>(FilesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateOkrProgress', () => {
    it('should call FilesService.generateOkrProgress with correct parameters', async () => {
      const projectId = 1;
      const year = 2024;
      const result = 
      { projectId: 1,
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
      };

      mockFilesService.generateOkrProgress.mockResolvedValueOnce({
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

      const response = await controller.getPdfOkrProgress(projectId, year);

      expect(service.generateOkrProgress).toHaveBeenCalledWith(projectId, year);
      
      expect(response).toStrictEqual(result);
    });
  });

  describe('getPdfTaskPerformance', () => {
    it('should return the task performance data with the correct structure', async () => {
      const projectId = 1;
      const year = 2023;
  
      const mockResult = {
        projectId: 1,
        projectName: 'Project 1',
        performanceByObjective: [
          { objectiveName: 'Objective 1', columns: [{ task: 'Task 1' }] },
          { objectiveName: 'Objective 2', columns: [{ task: 'Task 2' }] },
        ],
        delayedTasks: {
          totalDelayedTasks: 2,
          delayedTasksByPriority: { high: 1, medium: 1, low: 0 },
          delayReasons: [
            { reason: 'Reason 1', tasks: [{ taskName: 'Task 1' }] },
            { reason: 'Reason 2', tasks: [{ taskName: 'Task 2' }] },
          ],
        },
      };
  
      mockFilesService.generatePdfTaskPerformance.mockResolvedValueOnce(mockResult);
  
      const response = await controller.getPdfTaskPerformance(projectId, year);
  
      expect(service.generatePdfTaskPerformance).toHaveBeenCalledWith(projectId, year);
      expect(response).toEqual(mockResult);
      expect(response).toHaveProperty('projectId', projectId);
      expect(response.performanceByObjective).toBeInstanceOf(Array);
      expect(response.delayedTasks.totalDelayedTasks).toBe(2);
      expect(response.delayedTasks.delayedTasksByPriority).toMatchObject({
        high: 1,
        medium: 1,
        low: 0,
      });
      expect(response.delayedTasks.delayReasons[0]).toHaveProperty('reason', 'Reason 1');
    });
  });

  describe('getPdfDeadLines', () => {
    it('should return the deadlines data with the correct structure', async () => {
      const projectId = 1;
      const year = 2024;
  
      const mockResult = {
        projectId: 1,
        projectName: 'Project Alpha',
        objectives: [
          {
            objectiveName: 'Increase market share',
            completionDate: '2024-06-30',
            keyResults: [
              { keyResultName: 'Launch new product', progress: 50 },
              { keyResultName: 'Expand to new regions', progress: 20 },
            ],
            completionPercentage: 33,
          },
          {
            objectiveName: 'Improve customer satisfaction',
            completionDate: '2024-10-31',
            keyResults: [
              { keyResultName: 'Reduce response time', progress: 80 },
              { keyResultName: 'Increase NPS score', progress: 50 },
            ],
            completionPercentage: 67,
          },
        ],
      };
  
      mockFilesService.generatePdfDeadLines.mockResolvedValueOnce(mockResult);
  
      const response = await controller.getPdfDeadLines(projectId, year);
  
      expect(service.generatePdfDeadLines).toHaveBeenCalledWith(projectId, year);
      expect(response).toEqual(mockResult);
      expect(response).toHaveProperty('projectId', projectId);
      expect(response.projectName).toBe('Project Alpha');
      expect(response.objectives).toBeInstanceOf(Array);
      expect(response.objectives).toHaveLength(2);
    });
  });
});
