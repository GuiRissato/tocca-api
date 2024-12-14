import { Injectable } from '@nestjs/common';
import { DelayedTaskSummary, ImportantDatesPdfData, OkrProgress, TaskPerformance } from './interfaces/interfaces.files';
import { getYear } from 'date-fns';
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

  async generateOkrProgress( projectId: number, year: number): Promise<OkrProgress> {
    try {
      const okrProject = await this.OkrProjectsService.findOne(projectId);
  
      if (!okrProject) {
        throw new Error('Projeto não encontrado!');
      }
  
      const objectives = await this.ObjectivesService.findAll(projectId);

      const filteredObjectives = objectives.filter(objective => getYear(objective.created_at) === year);
      
      let keyResults: KeyResults[] = [];

      for (let obj of filteredObjectives) {
        const krs = await this.keyResultsService.findAll(obj.id);
        keyResults.push(...krs);
      }

      const keyResultIds = keyResults.map((kr) => kr.id);

      let tasks: Tasks[] = []
      
      for (let keyResult of keyResultIds){
        const tks = await this.tasksService.findAll(keyResult);
        tasks.push(...tks);
      }

      let columnsKeyResults: ColumnsKeyResults[] = []

      for (let task of tasks){
        const columnsKR = await this.columnsKeyResultsService.findAll(task.columnKeyResultId.id)
        columnsKeyResults.push(...columnsKR)
      }

      const columnIdToNameMap = columnsKeyResults.reduce((acc, column) => {
        acc[column.id] = column.column_name;
        return acc;
      }, {} as Record<number, string>);


  
      const columnCounts = tasks.reduce((acc, task) => {
        const columnName = columnIdToNameMap[task.columnKeyResultId.id];
        if (columnName) {
          acc[columnName] = (acc[columnName] || 0) + 1;      
        }
        return acc;
      }, {} as Record<string, number>);

      console.log(columnCounts)

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

    const keyResultIds = keyResults.map(kr => kr.id);

    let allTasks: Tasks[] = [];
    for (const keyResultId of keyResultIds) {
      const tasks = await this.tasksService.findAll(keyResultId);
      allTasks = allTasks.concat(tasks);
    }

    const completedTasks = allTasks.filter(
      task => task.columnKeyResultId && task.columnKeyResultId.column_name === 'Fechado'
    );
  
    const totalTasks = allTasks.length;
    const completedCount = completedTasks.length;
    const progress = totalTasks > 0 ? parseFloat(((completedCount / totalTasks) * 100).toFixed(2)) : 0;
  
    return progress;
  }

  async generatePdfTaskPerformance( projectId: number, year: number): Promise<TaskPerformance> {
    try {

      const okrProject = await this.OkrProjectsService.findOne(projectId);

      if (!okrProject) {
        throw new Error('Projeto não encontrado!');
      }

      const objectives = await this.ObjectivesService.findAll(projectId);

      const filteredObjectives = objectives.filter(objective => getYear(objective.created_at) === year);

      let keyResults: KeyResults[] = [];

      for (let obj of filteredObjectives) {
        const krs = await this.keyResultsService.findAll(obj.id);
        keyResults.push(...krs);
      }
      const keyResultIds = keyResults.map((kr) => kr.id);

      let tasks: Tasks[] = []
      
      for (let keyResult of keyResultIds){
        const tks = await this.tasksService.findAll(keyResult);
        tasks.push(...tks);
      }

      const performanceByObjective = filteredObjectives.map((obj) => {
        const relatedKeyResults = keyResults.filter((kr) => kr.objective_id === obj.id);
        const relatedTasks = tasks.filter((task) =>
          relatedKeyResults.some((kr) => kr.id === task.key_result_id),
        );

        const expectedColumns = ['Para Fazer', 'Em Progresso', 'Fechado'];

        const columnPerformance = expectedColumns.map((columnName) => {
          const columnTasks = relatedTasks.filter((task) => task.columnKeyResultId.column_name === columnName);
          const totalTasks = columnTasks.length;

          const averageCompletionTime =
            totalTasks > 0
              ? columnTasks.reduce((sum, task) => sum + task.due_date.getTime() - task.created_at.getTime(), 0) / totalTasks
              : 0;

          return {
            columnName,
            totalTasks,
            averageCompletionTime,
          };
        });

        return {
          objectiveName: obj.objective_name,
          result: columnPerformance,
        };
      });

      const delayedTasks = this.getDelayedTasks(tasks);

      return {
        projectId,
        projectName: okrProject.project_name,
        performanceByObjective,
        delayedTasks,
      };
    } catch (error) {
      console.error('Erro ao gerar o PDF de desempenho das tarefas', error.message);
      throw new Error(error ? error.message : 'Erro ao gerar o PDF de desempenho das tarefas');
    }
  }
  
  private getDelayedTasks(tasks: Tasks[]): DelayedTaskSummary {
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
    
      return {
        totalDelayedTasks: delayedTasks.length,
        delayedTasksByPriority,
        delayReasons: Object.entries(groupedByReason).map(([reason, tasks]) => ({
          reason,
          tasks: tasks.map((task) => ({
            taskName: task.task_name,
            objectiveName: task.keyResultId.objective.objective_name,
            keyResultName: task.keyResultId.key_result_name,
          })),
        })),
      };
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
    year: number
  ): Promise<ImportantDatesPdfData> {
    try {

      const okrProject = await this.OkrProjectsService.findOne(projectId);

      if (!okrProject) {
        throw new Error('Projeto não encontrado!');
      }

      const objectives = await this.ObjectivesService.findAll(projectId);

      const filteredObjectives = objectives.filter(objective => getYear(objective.created_at) === year);
      
      let keyResults: KeyResults[] = [];

      for (let obj of filteredObjectives) {
        const krs = await this.keyResultsService.findAll(obj.id);
        keyResults.push(...krs);
      }

       const keyResultIds = keyResults.map((kr) => kr.id);

      let tasks: Tasks[] = []
      
      for (let keyResult of keyResultIds){
        const tks = await this.tasksService.findAll(keyResult);
        tasks.push(...tks);
      }

      const objectivesData = objectives.map((objective) => {
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
        const completedTasks = relatedTasks.filter(
          (task) => task.columnKeyResultId.column_name === 'Finalizadas'
        ).length;
        const completionPercentage =
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        return {
          objectiveName: objective.objective_name,
          completionDate: completionDate
            ? completionDate.toISOString().split('T')[0]
            : null,
          keyResults: relatedKeyResults.map((kr) => ({
            name: kr.key_result_name,
            dueDate: kr.end_date?.toISOString().split('T')[0] || null,
          })),
          completionPercentage: Math.round(completionPercentage),
        };
      });

      return {
        projectId,
        projectName: okrProject.project_name,
        objectives: objectivesData,
      };
    } catch (error) {
      console.error(
        'Erro ao gerar o PDF de prazos e datas importantes',
        error.message
      );
      throw new Error('Erro ao gerar o PDF de prazos e datas importantes');
    }
  }

}