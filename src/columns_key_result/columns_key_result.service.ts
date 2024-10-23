import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnsKeyResultDto } from './dto/create-columns_key_result.dto';
import { UpdateColumnsKeyResultDto } from './dto/update-columns_key_result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnsKeyResult } from './entities/columns_key_result.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ColumnsKeyResultService {
  constructor(
    @InjectRepository(ColumnsKeyResult)
    private readonly repository: Repository<ColumnsKeyResult>,
  ) {}
  create(
    createColumnsKeyResultDto: CreateColumnsKeyResultDto,
  ): Promise<ColumnsKeyResult> {
    try {
      const columnKeyResult = this.repository.create(createColumnsKeyResultDto);
      return this.repository.save(columnKeyResult);
    } catch (error) {
      console.error('error creating column key result', error.message);
      throw 'error creating column key result' + error.message;
    }
  }

  findAll(keyResultId: number): Promise<ColumnsKeyResult[]> {
    try {
      const allColumnsByKeyResult = this.repository.find({
        where: { key_result_id: keyResultId },
      });
      return allColumnsByKeyResult;
    } catch (error) {
      console.error('Error finding all columns from key result', error.message);
      throw new Error('Error retrieving columns by key result ID');
    }
  }

  findOne(id: number): Promise<ColumnsKeyResult> {
    try {
      const findOneColumn = this.repository.findOne({ where: { id } });
      return findOneColumn;
    } catch (error) {
      console.error('Error finding one column', error.message);
      throw 'Error finding one column';
    }
  }

  async update(
    id: number,
    updateColumnsKeyResultDto: UpdateColumnsKeyResultDto,
  ): Promise<ColumnsKeyResult> {
    try {
      const columnKeyResult = await this.repository.preload({
        id: id,
        ...updateColumnsKeyResultDto,
      });

      if (!columnKeyResult) {
        throw new NotFoundException(`Column ${id} not found`);
      }
      return this.repository.save(columnKeyResult);
    } catch (error) {
      console.error('error updating column key result', error.message);
      throw new NotFoundException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const columnKeyResult = await this.findOne(id);
      return this.repository.remove(columnKeyResult);
    } catch (error) {
      console.error('error deleting column', error.message);
      throw 'error deleting column';
    }
  }
}
