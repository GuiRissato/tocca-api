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
      const savedTag: Tag = {
        id: 1, ...createTagDto,
        company: new Company(),
        created_at: undefined,
        updated_at: undefined
      };

      jest.spyOn(repository, 'create').mockReturnValue(savedTag);
      jest.spyOn(repository, 'save').mockResolvedValue(savedTag);

      expect(await service.create(createTagDto)).toEqual(savedTag);
    });
  });

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      const companyId = 1;
      const tags: Tag[] = [{
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
      }
    ];

      jest.spyOn(repository, 'find').mockResolvedValue(tags);

      expect(await service.findAll(companyId)).toEqual(tags);
    });
  });

  describe('findOne', () => {
    it('should return a tag if found', async () => {
      const tagId = 1;
      const tag:Tag = {
        id: tagId, tag_name: 'Test Tag', company_id: 1,
        company: new Company(),
        created_at: undefined,
        updated_at: undefined
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(tag);

      expect(await service.findOne(tagId)).toEqual(tag);
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
        tag_name: 'Updated Tag',
        company: new Company(),
        created_at: new Date(),
        updated_at: new Date()
      };
  
      jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(repository, 'findOne').mockResolvedValue(updatedTag);
  
      const result = await service.update(tagId, updateTagDto);
  
      expect(repository.update).toHaveBeenCalledWith(tagId, updateTagDto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: tagId } });
      expect(result).toEqual(updatedTag);
    });
  
    it('should throw NotFoundException if tag not found during update', async () => {
      const tagId = 1;
      const updateTagDto: UpdateTagDto = { tag_name: 'Updated Tag' };
  
      jest.spyOn(repository, 'update').mockResolvedValue({ affected: 0 } as any);
  
      await expect(service.update(tagId, updateTagDto)).rejects.toThrow('Failed to update the tag');
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      const tagId = 1;

      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await expect(service.remove(tagId)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if tag not found during removal', async () => {
      const tagId = 1;

      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(tagId)).rejects.toThrow('Failed to remove the tag');
    });
  });
});