import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOkrProjectDto } from './dto/create-okr_project.dto';
import { UpdateOkrProjectDto } from './dto/update-okr_project.dto';
import { OkrProject } from './entities/okr_project.entity';

@Injectable()
export class OkrProjectsService {
  constructor(
    @InjectRepository(OkrProject)
    private readonly repository: Repository<OkrProject>,
  ) {}
  create(createOkrProjectDto: CreateOkrProjectDto): Promise<OkrProject> {
    try {
      const okrProject = this.repository.create(createOkrProjectDto);
      return this.repository.save(okrProject);
    } catch (error) {
      console.log('error creating okr project', error.message);
      throw 'error creating okr project' + error.message;
    }
  }

  findAll(companyId: number): Promise<OkrProject[]> {
    try {
      const allOkrProjectsByCompany = this.repository.find({
        where: { company_id: companyId },
      });
      return allOkrProjectsByCompany;
    } catch (error) {
      console.log('Error retrieving OKR projects by company ID', error.message);
      throw new Error('Error retrieving OKR projects by company ID');
    }
  }

  findOne(id: number): Promise<OkrProject> {
    try {
      const findOneOkrProject = this.repository.findOne({ where: { id } });
      return findOneOkrProject;
    } catch (error) {
      console.log('error find one okr project', error.message);
      throw 'Error find one okr project';
    }
  }

  async update(id: number, updateOkrProjectDto: UpdateOkrProjectDto) {
    try {
      const okrProject = await this.repository.preload({
        id: id,
        ...updateOkrProjectDto,
      });

      if (!okrProject) {
        throw new NotFoundException(`Okr project  ${id} not found`);
      }

      return this.repository.save(okrProject);
    } catch (error) {
      console.log('error updating okrproject', error.message);
      throw new NotFoundException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const okrProject = await this.findOne(id);
      return this.repository.remove(okrProject);
    } catch (error) {
      console.log('error delenting okr project', error.message);
      throw 'error deleting company';
    }
  }
}
