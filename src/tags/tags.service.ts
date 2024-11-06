import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      const newTag = this.tagRepository.create(createTagDto);
      return await this.tagRepository.save(newTag);
    } catch (error) {
      console.error( 'Failed to create a new tag', error.message);
      throw new Error('Failed to create a new tag');
    }
  }

  async findAll(companyId: number): Promise<Tag[]> {
    try {
      return await this.tagRepository.find({
        where: { company_id: companyId },
      });
    } catch (error) {
      console.error('Failed to retrieve tags for the company', error.message);
      throw new Error('Failed to retrieve tags for the company');
    }
  }

  async findOne(id: number): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findOne({ where: { id: id}});
      if (!tag) {
        throw new NotFoundException(`Tag with id ${id} not found`);
      }
      return tag;
    } catch (error) {
      console.error( 'Failed to retrieve the tag', error.message);
      throw new Error('Failed to retrieve the tag');
    }
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    try {
      await this.tagRepository.update(id, updateTagDto);
      const updatedTag = await this.tagRepository.findOne({ where: { id: id}});
      if (!updatedTag) {
        throw new NotFoundException(`Tag with id ${id} not found`);
      }
      return updatedTag;
    } catch (error) {
      console.error( 'Failed to update the tag', error.message);
      throw new Error('Failed to update the tag' + error.message);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.tagRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Tag with id ${id} not found`);
      }
    } catch (error) {
      console.error('Failed to remove the tag', error.message);
      throw new Error('Failed to remove the tag');
    }
  }
}