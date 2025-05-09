import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateKeyResultDto } from './dto/create-key_result.dto';
import { UpdateKeyResultDto } from './dto/update-key_result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { KeyResults } from './entities/key_result.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KeyResultsService {
  constructor(
    @InjectRepository(KeyResults)
    private readonly repository: Repository<KeyResults>,
  ) {}
  create(createKeyResultDto: CreateKeyResultDto): Promise<KeyResults> {
    try {
      const createKeyResult = this.repository.create(createKeyResultDto);
      return this.repository.save(createKeyResult);
    } catch (error) {
      console.error('error creating key result', error.message);
      throw 'error creating key result' + error.message;
    }
  }

  findAll(objectiveId: number): Promise<KeyResults[]> {
    try {
      const allKeyResults = this.repository.find({
        where: { objective_id: objectiveId },
      });

      return allKeyResults;
    } catch (error) {
      console.error('error finding key result by object_id', error.message);
      throw 'error finding key result by object_id' + error.message;
    }
  }

  findOne(id: number): Promise<KeyResults> {
    try {
      const foundKeyResult = this.repository.findOne({ where: { id } });
      return foundKeyResult;
    } catch (error) {
      console.error('error finding one key result', error.message);
      throw 'error finding one key result' + error.message;
    }
  }

  async update(
    id: number,
    updateKeyResultDto: UpdateKeyResultDto,
  ): Promise<KeyResults> {
    try {
      const keyResult = await this.repository.findOne({ where: { id } });
      if (!keyResult) {
        throw new NotFoundException(`Key result ${id} não encontrado`);
      }
      
      this.repository.merge(keyResult, updateKeyResultDto);
      
      return await this.repository.save(keyResult);
    } catch (error) {
      console.error('error updating key result', error.message);
      throw new NotFoundException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const keyResultToDelete = await this.findOne(id);
      if (!keyResultToDelete) {
        throw new NotFoundException(`Key result ${id} not found`);
      }
      return this.repository.remove(keyResultToDelete);
    } catch (error) {
      console.error('error deleting key result', error.message);
      throw new NotFoundException(error.message);
    }
  }
}
