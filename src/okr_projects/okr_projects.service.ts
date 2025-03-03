import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOkrProjectDto } from './dto/create-okr_project.dto';
import { UpdateOkrProjectDto } from './dto/update-okr_project.dto';
import { OkrProjects } from './entities/okr_project.entity';

@Injectable()
export class OkrProjectsService {
  constructor(
    @InjectRepository(OkrProjects)
    private readonly repository: Repository<OkrProjects>,
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

  findAll(companyId: number): Promise<OkrProjects[]> {
    try {
      const company: any = companyId;
      const allOkrProjectsByCompany = this.repository.find({
        where: { company_id: parseInt(company.companyId) },
      });
      return allOkrProjectsByCompany;
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
