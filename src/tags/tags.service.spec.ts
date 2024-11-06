import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { Company } from '../companies/entities/company.entity';
import { UpdateTagDto } from './dto/update-tag.dto';

describe('TagsService', () => {
  let service: TagsService;
  let repository: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    repository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const createTagDto: CreateTagDto = { tag_name: 'Test Tag', company_id: 1 };
      const createTag: Tag = {
        id: 1, ...createTagDto,
        company: new Company(),
        created_at: new Date(),
        updated_at: new Date()
      };
  
      jest.spyOn(repository, 'create').mockReturnValue(createTag);
      jest.spyOn(repository, 'save').mockResolvedValue(createTag);
  
      expect(await service.create(createTagDto)).toEqual(createTag);
    });
  
    it('should throw an error if creation fails', async () => {
      const createTagDto: CreateTagDto = { tag_name: 'Test Tag', company_id: 1 };
  
      jest.spyOn(repository, 'create').mockImplementation(() => {
        throw new Error('Database error');
      });
  
      await expect(service.create(createTagDto)).rejects.toThrow('Failed to create a new tag');
    });
  });

  describe('findAll', () => {
  it('should return an array of tags', async () => {
    const companyId = 1;
    const mockTags: Tag[] = [{
      id: 1, tag_name: 'Test Tag', company_id: companyId,
      company: new Company(),
      created_at: undefined,
      updated_at: undefined
    },
    {
      id: 2, tag_name: 'Test Tag 2', company_id: companyId,
      company: new Company(),
      created_at: undefined,
      updated_at: undefined
    }];

    jest.spyOn(repository, 'find').mockResolvedValue(mockTags);

    expect(await service.findAll(companyId)).toEqual(mockTags);
  });

  it('should throw an error if retrieval fails', async () => {
    const companyId = 1;

    jest.spyOn(repository, 'find').mockImplementation(() => {
      throw new Error('Database error');
    });

    await expect(service.findAll(companyId)).rejects.toThrow('Failed to retrieve tags for the company');
  });
});

  describe('findOne', () => {
    it('should return a tag if found', async () => {
      const tagId = 1;
      const mockTag:Tag = {
        id: tagId, tag_name: 'Test Tag', company_id: 1,
        company: new Company(),
        created_at: undefined,
        updated_at: undefined
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTag);

      expect(await service.findOne(tagId)).toEqual(mockTag);
    });

    it('should throw NotFoundException if tag not found', async () => {
      const tagId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(tagId)).rejects.toThrow('Failed to retrieve the tag');
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const tagId = 1;
      const updateTagDto: UpdateTagDto = { tag_name: 'Updated Tag' };
      const updatedTag: Tag = {
        id: tagId,
        company_id: 1,
        tag_name: '',
        company: new Company(),
        created_at: new Date(),
        updated_at: new Date()
      };
  
      jest.spyOn(repository, 'preload').mockResolvedValue(updatedTag);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedTag);
  
      const result = await service.update(tagId, updateTagDto);
  
      expect(result).toEqual(updatedTag);
    });
  
    it('should throw NotFoundException if tag not found during update', async () => {
      const tagId = 1;
      const updateTagDto: UpdateTagDto = { tag_name: 'Updated Tag' };
  
      jest.spyOn(repository, 'preload').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(null);
  
      await expect(service.update(tagId, updateTagDto)).rejects.toThrow('Failed to update the tag');
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      const tagId = 1;
      const mockTag: Tag = {
        id: tagId, tag_name: 'Test Tag', company_id: 1,
         company: new Company(),
         created_at: new Date(),
         updated_at: new Date()
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTag);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockTag);

      await expect(service.remove(tagId)).resolves.toBe(mockTag);
    });

    it('should throw NotFoundException if tag not found during removal', async () => {
      const tagId = 1;
      const mockTag: Tag = {
        id: 999, tag_name: 'Test Tag', company_id: 1,
         company: new Company(),
         created_at: new Date(),
         updated_at: new Date()
      };

      jest.spyOn(repository, 'remove').mockResolvedValue(mockTag);

      await expect(service.remove(tagId)).rejects.toThrow('Failed to remove the tag');
    });
  });
});