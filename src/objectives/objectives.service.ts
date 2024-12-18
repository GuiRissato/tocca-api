import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';
import { Objectives } from './entities/objective.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ObjectivesService {
  constructor(
    @InjectRepository(Objectives)
    private readonly repository: Repository<Objectives>,
  ) {}

  create(createObjectiveDto: CreateObjectiveDto): Promise<Objectives> {
    try {
      const objective = this.repository.create(createObjectiveDto);
      return this.repository.save(objective);
    } catch (error) {
      console.error('error creating objective', error.message);
      throw 'error creating objective' + error.message;
    }
  }

 async  findAll(projectId: number): Promise<Objectives[]> {
    try {
      const allObjectives = await this.repository.find({
        where: { project_id: projectId },
      });
      return allObjectives;
    } catch (error) {
      console.error('error finding objectives by project_id', error.message);
      throw 'error finding objectives by project_id' + error.message;
    }
  }

  findOne(id: number): Promise<Objectives> {
    try {
      const foundObjective = this.repository.findOne({ where: { id } });
      return foundObjective;
    } catch (error) {
      console.error('error finding one objective', error.message);
      throw 'error finding one objective' + error.message;
    }
  }

  async update(
    id: number,
    updateObjectiveDto: UpdateObjectiveDto,
  ): Promise<Objectives> {
    try {
      const objective = await this.repository.preload({
        id: id,
        ...updateObjectiveDto,
      });

      if (!objective) {
        throw new NotFoundException(`Objective ${id} not found`);
      }
      return this.repository.save(objective);
    } catch (error) {
      console.error('error updating objective', error.message);
      throw new NotFoundException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const objectiveToDelete = await this.findOne(id);
      if (!objectiveToDelete) {
        throw new NotFoundException(`Objective ${id} not found`);
      }
      return this.repository.remove(objectiveToDelete);
    } catch (error) {
      console.error('error deleting objective', error.message);
      throw new NotFoundException(error.message);
    }
  }
}
