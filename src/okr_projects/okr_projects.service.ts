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

      let allObjectives = []

      for (let project of allOkrProjectsByCompany){
        const resp = await this.objectivesService.findAll(project.id)
        allObjectives.push(resp[0])
      }

      let allKeyResultByObjectives = []

      for (let objective of allObjectives){
        const resp = await this.keyResultsService.findAll(objective.id)
        allKeyResultByObjectives.push(resp)
      }

      let allColumnsByKeyResults = []
      for (let keyResult of allKeyResultByObjectives){
        // ajustar aqui
        const resp = await this.columnsKeyResult.findAll(keyResult.id)
        allColumnsByKeyResults.push([resp])
      }

      let allTasks = []
      for (let keyResult of allKeyResultByObjectives){
        const resp = await this.tasksService.findAll(keyResult.id)
        allTasks.push(resp[0])
      }

      
      return {
        allOkrProjectsByCompany,
        allObjectives,
        allKeyResultByObjectives,
        allColumnsByKeyResults,
        allTasks
        };
    } catch (error) {
      console.error(
        'Error retrieving OKR projects by company ID',
        error.message,
      );
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

  async update(
    id: number,
    updateOkrProjectDto: UpdateOkrProjectDto,
  ): Promise<OkrProjects> {
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
      if(!okrProject){
        throw new NotFoundException(`Okr project ${id} not found`);
      }
      return this.repository.remove(okrProject);
    } catch (error) {
      console.error('error delenting okr project', error.message);
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
