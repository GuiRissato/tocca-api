import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnsKeyResultDto } from './dto/create-columns_key_result.dto';
import { UpdateColumnsKeyResultDto } from './dto/update-columns_key_result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnsKeyResults } from './entities/columns_key_result.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ColumnsKeyResultService {
  constructor(
    @InjectRepository(ColumnsKeyResults)
    private readonly repository: Repository<ColumnsKeyResults>,
  ) {}
  create(
    createColumnsKeyResultDto: CreateColumnsKeyResultDto,
  ): Promise<ColumnsKeyResults> {
    try {
      const columnKeyResult = this.repository.create(createColumnsKeyResultDto);
      return this.repository.save(columnKeyResult);
    } catch (error) {
      console.error('error creating column key result', error.message);
      throw 'error creating column key result' + error.message;
    }
  }

  findAll(keyResultId: number): Promise<ColumnsKeyResults[]> {
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

  findOne(id: number): Promise<ColumnsKeyResults> {
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
  ): Promise<ColumnsKeyResults> {
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
