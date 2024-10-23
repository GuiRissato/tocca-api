import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateKeyResultDto } from './dto/create-key_result.dto';
import { UpdateKeyResultDto } from './dto/update-key_result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { KeyResult } from './entities/key_result.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KeyResultsService {
  constructor(
    @InjectRepository(KeyResult)
    private readonly repository: Repository<KeyResult>,
  ) {}
  create(createKeyResultDto: CreateKeyResultDto): Promise<KeyResult> {
    try {
      const createKeyResult = this.repository.create(createKeyResultDto);
      return this.repository.save(createKeyResult);
    } catch (error) {
      console.log('error creating key result', error.message);
      throw 'error creating key result' + error.message;
    }
  }

  findAll(objectiveId: number): Promise<KeyResult[]> {
    try {
      const allKeyResults = this.repository.find({
        where: { objective_id: objectiveId },
      });

      return allKeyResults;
    } catch (error) {
      console.log('error finding key result by object_id', error.message);
      throw 'error finding key result by object_id' + error.message;
    }
  }

  findOne(id: number): Promise<KeyResult> {
    try {
      const foundKeyResult = this.repository.findOne({ where: { id } });
      return foundKeyResult;
    } catch (error) {
      console.log('error finding one key result', error.message);
      throw 'error finding one key result' + error.message;
    }
  }

  async update(
    id: number,
    updateKeyResultDto: UpdateKeyResultDto,
  ): Promise<KeyResult> {
    try {
      const keyResult = await this.repository.preload({
        id: id,
        ...updateKeyResultDto,
      });

      if (!keyResult) {
        throw new NotFoundException(`key result ${id} not found`);
      }
      return this.repository.save(keyResult);
    } catch (error) {
      console.log('error updating key result', error.message);
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
      console.log('error deleting key result', error.message);
      throw new NotFoundException(error.message);
    }
  }
}
