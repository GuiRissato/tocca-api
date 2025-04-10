import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';
import { Objectives } from './entities/objective.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { KeyResultsService } from 'src/key_results/key_results.service';
import { ObjectiveWithKeyResults } from './entities/objectiveWithKeyResults';

@Injectable()
export class ObjectivesService {
  
  constructor(
    @InjectRepository(Objectives)
    private readonly repository: Repository<Objectives>,
    private readonly keyResultsService: KeyResultsService,
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

  async findObjectivesAndKeyResults(projectId: number): Promise<ObjectiveWithKeyResults[]> {
    try {
      const allObjectives = await this.repository.find({
        where: { project_id: projectId },
      });

      const objectivesWithKeyResults: ObjectiveWithKeyResults[] = [];
      
      for (let objective of allObjectives) {
        const keyResults = await this.keyResultsService.findAll(objective.id);
        
        const objectiveWithKeyResults: ObjectiveWithKeyResults = {
          ...objective,
          key_results: keyResults
        };
        
        objectivesWithKeyResults.push(objectiveWithKeyResults);
      }
      
      return objectivesWithKeyResults;
    } catch (error) {
      console.error('error finding objectives and key results', error.message);
      throw 'error finding objectives and key results' + error.message;
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
