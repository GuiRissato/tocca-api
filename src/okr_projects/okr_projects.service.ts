
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOkrProjectDto } from './dto/create-okr_project.dto';
import { UpdateOkrProjectDto } from './dto/update-okr_project.dto';
import { OkrProjects } from './entities/okr_project.entity';
import { ObjectivesService } from 'src/objectives/objectives.service';
import { KeyResultsService } from 'src/key_results/key_results.service';
import { TasksService } from 'src/tasks/tasks.service';
import { ColumnsKeyResultService } from 'src/columns_key_result/columns_key_result.service';

function calculateKeyResultProgress(
  keyResult: { id: number; status: string },
  tasks: { id: number; key_result_id: number; column_key_result_id: number }[],
  columns: { id: number; key_result_id: number; column_name: string }[]
): number {
  const tasksForKR = tasks.filter(task => task.key_result_id === keyResult.id);
  if (tasksForKR.length === 0) {
    return keyResult.status.toLowerCase() === 'fechado' ? 100 : 0;
  }
  const completeColumnNames = ['fechado'];
  const columnsForKR = columns.filter(col => col.key_result_id === keyResult.id);
  const completeColumnIds = columnsForKR
    .filter(col => completeColumnNames.includes(col.column_name.toLowerCase()))
    .map(col => col.id);
  const completedTasksCount = tasksForKR.filter(task =>
    completeColumnIds.includes(task.column_key_result_id)
  ).length;
  return (completedTasksCount / tasksForKR.length) * 100;
}

@Injectable()
export class OkrProjectsService {
  constructor(
    @InjectRepository(OkrProjects)
    private readonly repository: Repository<OkrProjects>,
    private readonly objectivesService: ObjectivesService,
    private readonly keyResultsService: KeyResultsService,
    private readonly tasksService: TasksService,
    private readonly columnsKeyResult: ColumnsKeyResultService,
  ) {}

  create(createOkrProjectDto: CreateOkrProjectDto): Promise<OkrProjects> {
    try {
      const okrProject = this.repository.create(createOkrProjectDto);
      return this.repository.save(okrProject);
    } catch (error) {
      console.error('error creating okr project', error.message);
      throw 'error creating okr project' + error.message;
    }
  }

  async findAll(companyId: number): Promise<any> {
    try {
      const company: any = companyId;
      const allOkrProjectsByCompany = await this.repository.find({
        where: { company_id: parseInt(company.companyId) },
      });

      const result = [];

      for (const project of allOkrProjectsByCompany) {
        const projectObjectives = await this.objectivesService.findAll(project.id);
        
        const objectivesProgressArray: number[] = [];
        const keyResultsProgressArray: number[] = [];

        for (const objective of projectObjectives) {

          const keyResults = await this.keyResultsService.findAll(objective.id);
          const binaryKeyResultsProgress: number[] = [];
          
          if (keyResults && keyResults.length) {
            for (const keyResult of keyResults) {

              const columns = await this.columnsKeyResult.findAll(keyResult.id);
              const tasks = await this.tasksService.findAll(keyResult.id);

              const progress = calculateKeyResultProgress(keyResult, tasks, columns);

              const binaryProgress = progress === 100 ? 100 : 0;
              keyResultsProgressArray.push(progress);
              binaryKeyResultsProgress.push(binaryProgress);
            }
          }

          const objectiveProgress = binaryKeyResultsProgress.length > 0 
            ? (binaryKeyResultsProgress.reduce((acc, curr) => acc + curr, 0) / binaryKeyResultsProgress.length)
            : 0;
          objectivesProgressArray.push(objectiveProgress);
        }

        const objectivesProgress = objectivesProgressArray.length > 0
          ? objectivesProgressArray.reduce((acc, curr) => acc + curr, 0) / objectivesProgressArray.length
          : 0;

        const keyResultsProgress = keyResultsProgressArray.length > 0
          ? keyResultsProgressArray.reduce((acc, curr) => acc + curr, 0) / keyResultsProgressArray.length
          : 0;

        result.push({
          project,
          objectivesProgress,
          keyResultsProgress
        });
      }

      return result;
    } catch (error) {
      console.error('Error retrieving OKR projects by company ID', error.message);
      throw new Error('Error retrieving OKR projects by company ID');
    }
  }

  findOne(id: number): Promise<OkrProjects> {
    try {
      const findOneOkrProject = this.repository.findOne({ where: { id } });
      return findOneOkrProject;
    } catch (error) {
      console.error('error find one okr project', error.message);
      throw 'Error find one okr project';
    }
  }

  async update(id: number, updateOkrProjectDto: UpdateOkrProjectDto): Promise<OkrProjects> {
    try {
      const okrProject = await this.repository.preload({
        id: id,
        ...updateOkrProjectDto,
      });
      if (!okrProject) {
        throw new NotFoundException(`Okr project ${id} not found`);
      }
      return this.repository.save(okrProject);
    } catch (error) {
      console.error('error updating okrproject', error.message);
      throw new NotFoundException(error.message);
    }
  }

  async remove(id: number): Promise<OkrProjects> {
    try {
      const okrProject = await this.findOne(id);
      if (!okrProject) {
        throw new NotFoundException(`Okr project ${id} not found`);
      }
      return this.repository.remove(okrProject);
    } catch (error) {
      console.error('error deleting okr project', error.message);
      throw 'error deleting company';
    }
  }

  async findAllDistinctYearsByCompany(companyId: number): Promise<number[]> {
    try {
      const result = await this.repository
        .createQueryBuilder('okr_projects')
        .select("DISTINCT EXTRACT(YEAR FROM okr_projects.created_at)", 'year')
        .where('okr_projects.company_id = :companyId', { companyId })
        .orderBy('year', 'ASC')
        .getRawMany();
      return result.map(item => parseInt(item.year, 10));
    } catch (error) {
      console.error('Error retrieving distinct project years by company ID', error.message);
      throw new Error('Error retrieving distinct project years by company ID');
    }
  }
}
