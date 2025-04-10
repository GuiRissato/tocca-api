import { Injectable } from '@nestjs/common';
import { DelayedTaskSummary, ImportantDatesPdfData, OkrProgress, TaskPerformance } from './interfaces/interfaces.files';
import { ObjectivesService } from '../objectives/objectives.service';
import { OkrProjectsService } from '../okr_projects/okr_projects.service';
import { TasksService } from '../tasks/tasks.service';
import { KeyResultsService } from '../key_results/key_results.service';
import { ColumnsKeyResultService } from '../columns_key_result/columns_key_result.service';
import { KeyResults } from '../key_results/entities/key_result.entity';
import { Tasks } from '../tasks/entities/task.entity';
import { ColumnsKeyResults } from 'src/columns_key_result/entities/columns_key_result.entity';

@Injectable()
export class FilesService {
  constructor(
    private readonly OkrProjectsService: OkrProjectsService,
    private readonly ObjectivesService: ObjectivesService,
    private readonly keyResultsService: KeyResultsService,
    private readonly tasksService: TasksService,
    private readonly columnsKeyResultsService: ColumnsKeyResultService,
  ) {}

  async generateOkrProgress( projectId: number): Promise<OkrProgress> {
    try {

      const okrProject = await this.OkrProjectsService.findOne(projectId);
  
      if (!okrProject) {
        throw new Error('Projeto não encontrado!');
      }
  
      const objectives = await this.ObjectivesService.findAll(projectId);

      let keyResults: KeyResults[] = [];

      for (let obj of objectives) {
        const krs = await this.keyResultsService.findAll(obj.id);
        keyResults.push(...krs);
      }

      let tasks: Tasks[] = []
      
      for (let keyResult of keyResults){
        const tks = await this.tasksService.findAll(keyResult.id);
        tasks.push(...tks);
      }
      let columnsKeyResults: ColumnsKeyResults[] = []

      for (let task of tasks){
        const columnsKR = await this.columnsKeyResultsService.findAll(task.key_result_id)
        columnsKeyResults.push(...columnsKR)
      }

      const columnIdToNameMap = columnsKeyResults.reduce((acc, column) => {
        acc[column.id] = column.column_name;
        return acc;
      }, {} as Record<number, string>);

      const columnCounts = tasks.reduce((acc, task) => {
        const columnName = columnIdToNameMap[task.column_key_result_id];
        if (columnName) {
          acc[columnName] = (acc[columnName] || 0) + 1;      
        }
        return acc;
      }, {} as Record<string, number>);
      
      const totalTasks = tasks.length;

      const expectedColumns = ['Para Fazer', 'Pendente', 'Em Progresso', 'Finalizado', 'Fechado'];

      const columnPercentages = expectedColumns.map(columnName => {
        const columnCount = columnCounts[columnName] || 0;
        return {
          columnName,
          percentage: totalTasks > 0 ? parseFloat(((columnCount / totalTasks) * 100).toFixed(2)) : 0,
        };
      });
  
      const objectivesProgress = await Promise.all(objectives.map(async obj => ({
        objectiveName: obj.objective_name,
        progress: await this.calculateObjectiveProgress(obj.id),
      })));
  
      const okrProgressResults: OkrProgress = {
        projectId,
        projectName: okrProject.project_name,
        objectives: objectivesProgress,
        keyResults: columnPercentages,
      };
  
      return okrProgressResults;
  
    } catch (error) {
      console.error('Error generating Okr Progress PDF', error.message);
      throw new Error(error ? error.message : 'Error generating Okr Progress PDF');
    }
  }
  
  async calculateObjectiveProgress(objectiveId: number): Promise<number> {
    const keyResults = await this.keyResultsService.findAll(objectiveId);

    let allTasks: Tasks[] = [];
    for (const keyResult of keyResults) {
      const tasks = await this.tasksService.findAll(keyResult.id);
      allTasks = allTasks.concat(tasks);
    }

    const completedTasks = (
      await Promise.all(
        allTasks.map(async (task) => ({
          task,
          columnName: (await this.columnsKeyResultsService.findOne(task.column_key_result_id)).column_name,
        }))
      )
    ).filter(({ columnName }) => columnName === 'Fechado').map(({ task }) => task);
  
    const totalTasks = allTasks.length;
    const completedCount = completedTasks.length;
    const progress = totalTasks > 0 ? parseFloat(((completedCount / totalTasks) * 100).toFixed(2)) : 0;
  
    return progress;
  }

  async generatePdfTaskPerformance(projectId: number): Promise<TaskPerformance> {
    try {
      const okrProject = await this.OkrProjectsService.findOne(projectId);
  
      if (!okrProject) {
        throw new Error('Projeto não encontrado!');
      }
  
      const objectives = await this.ObjectivesService.findAll(projectId);

      let keyResults: KeyResults[] = [];
  
      for (let obj of objectives) {
        const krs = await this.keyResultsService.findAll(obj.id);
        keyResults.push(...krs);
      }

      let tasks: Tasks[] = [];
  
      for (let keyResult of keyResults) {
        const tks = await this.tasksService.findAll(keyResult.id);
        tasks.push(...tks);
      }

      const expectedColumns = ['Para Fazer', 'Em Progresso', 'Fechado'];

      const performanceByObjective = await Promise.all(
        objectives.map(async (objective) => {
          const relatedKeyResults = keyResults.filter(
            (kr) => kr.objective_id === objective.id,
          );
    
          const relatedTasks = tasks.filter((task) =>
            relatedKeyResults.some((kr) => kr.id === task.key_result_id),
          );

          const averageCompletionTimes = await Promise.all(
            relatedKeyResults.map(async (kr) => {
              const averageTime = await this.calculateAverageCompletionTimeForKeyResult(kr.id);
              return {
                keyResultId: kr.id,
                keyResultName: kr.key_result_name,
                averageCompletionDays: averageTime,
              };
            }),
          );
    
          const tasksGroupedByColumn = await Promise.all(
            expectedColumns.map(async (columnName) => {
              const tasksInColumnPromises = relatedTasks.map(async (task) => {
                const column = await this.columnsKeyResultsService.findOne(
                  task.column_key_result_id,
                );

                return column && column.column_name === columnName ? task : null;
              });

              const tasksInColumn = (await Promise.all(tasksInColumnPromises)).filter(
                (task) => task !== null,
              );
    
              return {
                columnName,
                totalTasks: tasksInColumn.length,
                tasks: tasksInColumn,
              };
            }),
          );
    
          const totalObjectiveTasks = relatedTasks.length || 1;
          const columnsWithPercentage = tasksGroupedByColumn.map((group) => ({
            ...group,
            percentage: parseFloat(
              ((group.totalTasks / totalObjectiveTasks) * 100).toFixed(2),
            ),
          }));
    
          return {
            objectiveName: objective.objective_name,
            columns: columnsWithPercentage,
            averageCompletionTimes,
          };
        }),
      );

      const delayedTasks = await this.getDelayedTasks(tasks);

      return {
        projectId,
        projectName: okrProject.project_name,
        performanceByObjective,
        delayedTasks,
      };
    } catch (error) {
      console.error('Erro ao gerar o PDF de desempenho das tarefas', error.message);
      throw new Error(
        error ? error.message : 'Erro ao gerar o PDF de desempenho das tarefas'
      );
    }
  }

  async calculateAverageCompletionTimeForKeyResult(keyResultId: number): Promise<number> {
    
    const tasks = await this.tasksService.findAll(keyResultId);

    const closedTasksPromises = tasks.map(async (task) => {
      const column = await this.columnsKeyResultsService.findOne(task.column_key_result_id);
      return column?.column_name === 'Fechado' ? task : null;
    });
    const closedTasks = (await Promise.all(closedTasksPromises)).filter((t) => t !== null) as any[];

    if (!closedTasks.length) {
      return 0;
    }

    const differencesInDays = closedTasks.map((task) => {
      const timeDiffMs = new Date(task.updated_at).getTime() - new Date(task.created_at).getTime();
      const daysDiff = timeDiffMs / (1000 * 60 * 60 * 24);
      return daysDiff;
    });

    const totalDiff = differencesInDays.reduce((acc, diff) => acc + diff, 0);
    const averageDays = totalDiff / closedTasks.length;

    return parseFloat(averageDays.toFixed(2));
  }
  
  private async getDelayedTasks(tasks: Tasks[]): Promise<DelayedTaskSummary> {
    try {
      const now = Date.now();
      const delayedTasks = tasks.filter((task) => task.due_date.getTime() < now);

      const delayedTasksByPriority = {
        high: delayedTasks.filter(task => task.priority === 1).length,
        medium: delayedTasks.filter(task => task.priority === 2).length,
        low: delayedTasks.filter(task => task.priority === 3).length,
      };
  
      const groupedByReason = delayedTasks.reduce((acc, task) => {
        const reason = task.delay_reason || 'Desconhecido';
        if (!acc[reason]) {
          acc[reason] = [];
        }
        acc[reason].push(task);
        return acc;
      }, {} as Record<string, Tasks[]>);

      const response = {
        totalTasks: tasks.length,
        totalDelayedTasks: delayedTasks.length,
        delayedTasksByPriority,
        delayReasons: await Promise.all(
          Object.entries(groupedByReason).map(async ([reason, tasks]) => ({
            reason,
            tasks: await Promise.all(
              tasks.map(async (task) => ({
                taskName: task.task_name,
                objectiveName: (await this.ObjectivesService.findOne((await this.keyResultsService.findOne(task.key_result_id)).objective_id)).objective_name,
                keyResultName: (await this.keyResultsService.findOne(task.key_result_id)).key_result_name,
              }))
            ),
          }))
        ),
      };
    
      return response
    } catch (error) {
      console.error('error getting delayed tasks', error.message);
      return { 
        totalDelayedTasks: 0, 
        delayedTasksByPriority: { high: 0, medium: 0, low: 0 },
        delayReasons: [] 
      };
    }
  }

  async generatePdfDeadLines(
    projectId: number,
  ): Promise<ImportantDatesPdfData> {
    try {

      const okrProject = await this.OkrProjectsService.findOne(projectId);

      if (!okrProject) {
        throw new Error('Projeto não encontrado!');
      }

      const objectives = await this.ObjectivesService.findAll(projectId);
      
      let keyResults: KeyResults[] = [];

      for (let obj of objectives) {
        const krs = await this.keyResultsService.findAll(obj.id);
        keyResults.push(...krs);
      }

       const keyResultIds = keyResults.map((kr) => kr.id);

      let tasks: Tasks[] = []
      
      for (let keyResult of keyResultIds){
        const tks = await this.tasksService.findAll(keyResult);
        tasks.push(...tks);
      }

      const objectivesData = objectives.map(async (objective) => {
        const relatedKeyResults = keyResults.filter(
          (kr) => kr.objective_id === objective.id
        );

        const relatedTasks = tasks.filter((task) =>
          relatedKeyResults.some((kr) => kr.id === task.key_result_id)
        );

        const completionDate = relatedTasks.reduce((maxDate, task) => {
          const taskDueDate = task.due_date ? new Date(task.due_date) : null;
          return taskDueDate && (!maxDate || taskDueDate > maxDate)
            ? taskDueDate
            : maxDate;
        }, null as Date | null);

        const totalTasks = relatedTasks.length;
        const completedTasks = await Promise.all(
          relatedTasks.map(async (task) => {
            const columnName = (await this.columnsKeyResultsService.findOne(task.column_key_result_id)).column_name;
            return columnName === 'Fechado' ? task : null;
          })
        ).then(tasks => tasks.filter(task => task !== null));

        const completionPercentage =
          totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

        return {
          objectiveName: objective.objective_name,
          completionDate: completionDate
            ? completionDate.toISOString().split('T')[0]
            : null,
          keyResults: relatedKeyResults.map((kr) => ({
            name: kr.key_result_name,
            dueDate: String(new Date(kr.end_date))
          })),
          completionPercentage: Math.round(completionPercentage),
        };
      });

      return {
        projectId,
        projectName: okrProject.project_name,
        objectives: await Promise.all(objectivesData),
      };
    } catch (error) {
      console.error(
        'Erro ao gerar o PDF de prazos e datas importantes',
        error.message
      );
      if(error){
        throw new Error(error.message);
      }else{
        throw new Error('Erro ao gerar o PDF de prazos e datas importantes');
      }
    }
  }

}