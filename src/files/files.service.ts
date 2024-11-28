import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Objectives } from '../objectives/entities/objective.entity';
import { OkrProjects } from '../okr_projects/entities/okr_project.entity';
import { KeyResults } from '../key_results/entities/key_result.entity';
import { Tasks } from '../tasks/entities/task.entity';
import { DelayedTaskSummary, ImportantDatesPdfData, OkrProgress, TaskPerformance } from './interfaces/interfaces.files';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Objectives) private objectivesRepository: Repository<Objectives>,
    @InjectRepository(OkrProjects) private okrProjectsRepository: Repository<OkrProjects>,
    @InjectRepository(KeyResults) private keyResultsRepository: Repository<KeyResults>,
    @InjectRepository(Tasks) private tasksRepository: Repository<Tasks>,
  ) {}

  async generateOkrProgress(companyId: number, projectId: number, year: number): Promise<OkrProgress> {
    try {
      const okrProject = await this.okrProjectsRepository.findOne({
        where: { company_id: companyId, id: projectId },
      });
  
      if (!okrProject) {
        throw new Error('Projeto não encontrado!');
      }
  
      const objectives = await this.objectivesRepository
        .createQueryBuilder('objective')
        .where('objective.project_id = :projectId', { projectId })
        .andWhere('EXTRACT(YEAR FROM objective.created_at) = :year', { year })
        .getMany();
    
  
      const keyResults = await this.keyResultsRepository
        .createQueryBuilder('key_result')
        .where('key_result.objective_id IN (:objectiveIds)', { 
          objectiveIds: objectives.map(obj => obj.id),
        })
        .getMany();
    
      const tasks = await this.tasksRepository
        .createQueryBuilder('task')
        .where('task.key_result_id IN (:keyResultIds)', { 
          keyResultIds: keyResults.map(kr => kr.id),
        })
        .getMany();
  
      const columnCounts = tasks.reduce((acc, task) => {
        const columnName = task.column_key_result_id;
        acc[columnName] = (acc[columnName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
      const totalTasks = tasks.length;
      const columns = ['Para Fazer', 'Pendente', 'Em Progresso', 'Finalizado', 'Fechado'];
      const columnPercentages = columns.map(columnName => {
        const columnCount = columnCounts[columnName] || 0;
        return {
          columnName,
          percentage: totalTasks > 0 ? (columnCount / totalTasks) * 100 : 0,
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
      console.error('error generating Okr Progress PDF', error.message);
      throw new Error('error generating Okr Progress PDF');
    }
  }
  
  async calculateObjectiveProgress(objectiveId: number): Promise<number> {
    const tasks = await this.tasksRepository
      .createQueryBuilder('task')
      .where('task.key_result_id IN (SELECT id FROM key_results WHERE objective_id = :objectiveId)', { objectiveId })
      .getMany();
  
    const completedTasks = tasks.filter(task => task.columnKeyResultId.column_name === 'Finalizado').length;
    return tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  }


    async generatePdfTaskPerformance(companyId: number, projectId: number, year: number): Promise<TaskPerformance> {
      try {

        const okrProject = await this.okrProjectsRepository.findOne({
          where: { company_id: companyId, id: projectId },
        });
  
        if (!okrProject) {
          throw new Error('Projeto não encontrado!');
        }
  
        const objectives = await this.objectivesRepository
          .createQueryBuilder('objective')
          .where('objective.project_id = :projectId', { projectId })
          .andWhere('EXTRACT(YEAR FROM objective.created_at) = :year', { year })
          .getMany();
  
        const objectiveIds = objectives.map((obj) => obj.id);
        const keyResults = await this.keyResultsRepository
          .createQueryBuilder('key_result')
          .where('key_result.objective_id IN (:...objectiveIds)', { objectiveIds })
          .getMany();
  
        const keyResultIds = keyResults.map((kr) => kr.id);
        const tasks = await this.tasksRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.keyResultId', 'keyResult')
        .leftJoinAndSelect('keyResult.objective', 'objective')
        .where('task.key_result_id IN (:...keyResultIds)', { keyResultIds })
        .getMany();
  
        const performanceByObjective = objectives.map((obj) => {
          const relatedKeyResults = keyResults.filter((kr) => kr.objective_id === obj.id);
          const relatedTasks = tasks.filter((task) =>
            relatedKeyResults.some((kr) => kr.id === task.key_result_id),
          );
  
          const columns = ['Para Fazer', 'Em Progresso', 'Finalizadas'];
  
          const columnPerformance = columns.map((columnName) => {
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
        throw new Error('Erro ao gerar o PDF de desempenho das tarefas');
      }
    }
  
private getDelayedTasks(tasks: Tasks[]): DelayedTaskSummary {
  try {
    const delayedTasks = tasks.filter((task) => task.due_date.getTime() - task.created_at.getTime() < Date.now());
  
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
      reasons: Object.entries(groupedByReason).map(([reason, tasks]) => ({
        reason,
        tasks: tasks.map((task) => ({
          taskName: task.task_name,
          objectiveName: task.keyResultId.objective.objective_name,
          keyResultName: task.keyResultId.key_result_name,
        })),
      })),
    };
  } catch (error) {
    console.error( 'error getting delayed tasks', error.message);
    return { totalDelayedTasks: 0, reasons: [] };
  }
}

async generatePdfDeadLines(
  companyId: number,
  projectId: number,
  year: number
): Promise<ImportantDatesPdfData> {
  try {

    const okrProject = await this.okrProjectsRepository.findOne({
      where: { company_id: companyId, id: projectId },
    });

    if (!okrProject) {
      throw new Error('Projeto não encontrado!');
    }

    const objectives = await this.objectivesRepository
      .createQueryBuilder('objective')
      .where('objective.project_id = :projectId', { projectId })
      .andWhere('EXTRACT(YEAR FROM objective.created_at) = :year', { year })
      .getMany();

    const objectiveIds = objectives.map((obj) => obj.id);
    const keyResults = await this.keyResultsRepository
      .createQueryBuilder('key_result')
      .where('key_result.objective_id IN (:...objectiveIds)', { objectiveIds })
      .getMany();

    const keyResultIds = keyResults.map((kr) => kr.id);
    const tasks = await this.tasksRepository
      .createQueryBuilder('task')
      .where('task.key_result_id IN (:...keyResultIds)', { keyResultIds })
      .getMany();

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