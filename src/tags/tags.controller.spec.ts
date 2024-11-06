import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { Company } from '../companies/entities/company.entity';
import { NotFoundException } from '@nestjs/common';

const mockTagsService = {
  create: jest.fn(),
   findAll: jest.fn(),
   findOne: jest.fn(),
   update: jest.fn(),
   remove: jest.fn(),
};


describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: mockTagsService,
        },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      jest.spyOn(service, 'create').mockResolvedValue(createTag);

      const result = await controller.create(createTagDto);
      expect(result).toEqual(createTag);
    });
    it('should handle errors when creating a tag', async () => {
      const createTagDto: CreateTagDto = { tag_name: 'Test Tag', company_id: 1 };
      const errorMessage = 'Error creating tag';
  
      jest.spyOn(service, 'create').mockRejectedValue(new Error(errorMessage));
  
      await expect(controller.create(createTagDto)).rejects.toThrow(errorMessage);
    });
    
  });

  describe('findOne', () => {
    it('should return a single tag', async () => {
      const tagId = 1;
      const tag: Tag = {
        id: tagId,
        tag_name: 'Test Tag',
        company_id: 1,
        company: new Company(),
        created_at: new Date(),
        updated_at: new Date(),
      };
  
      jest.spyOn(service, 'findOne').mockResolvedValue(tag);
  
      const result = await controller.findOne(tagId);
      expect(result).toEqual(tag);
    });
  
    it('should throw NotFoundException when tag is not found', async () => {
      const tagId = 1;
  
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException(`Tag with id ${tagId} not found`));
  
      await expect(controller.findOne(tagId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      const companyId = 1;
      const tags: Tag[] = [
        {
          id: 1,
          tag_name: 'Tag 1',
          company_id: companyId,
          company: new Company(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          tag_name: 'Tag 2',
          company_id: companyId,
          company: new Company(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(tags);

      const result = await controller.findAll(companyId);
      expect(result).toEqual(tags);
    });

    it('should handle errors when retrieving tags', async () => {
      const companyId = 1;
      const errorMessage = 'Error retrieving tags';

      jest.spyOn(service, 'findAll').mockRejectedValue(new Error(errorMessage));

      await expect(controller.findAll(companyId)).rejects.toThrow(errorMessage);
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const tagId = 1;
      const updateTagDto: UpdateTagDto = { tag_name: 'Updated Tag' };
      const updatedTag: Tag = {
        id: tagId,
        tag_name: 'Updated Tag',
        company_id: 1,
        company: new Company(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedTag);

      const result = await controller.update(tagId, updateTagDto);
      expect(result).toEqual(updatedTag);
    });

    it('should throw NotFoundException when tag to update is not found', async () => {
      const tagId = 1;
      const updateTagDto: UpdateTagDto = { tag_name: 'Updated Tag' };

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException(`Tag with id ${tagId} not found`));

      await expect(controller.update(tagId, updateTagDto)).rejects.toThrow(NotFoundException);
    });

    it('should handle errors when updating a tag', async () => {
      const tagId = 1;
      const updateTagDto: UpdateTagDto = { tag_name: 'Updated Tag' };
      const errorMessage = 'Error updating tag';

      jest.spyOn(service, 'update').mockRejectedValue(new Error(errorMessage));

      await expect(controller.update(tagId, updateTagDto)).rejects.toThrow(errorMessage);
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      const tagId = 1;

      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await expect(controller.remove(tagId)).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(tagId);
    });

    it('should throw NotFoundException when tag to remove is not found', async () => {
      const tagId = 1;

      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException(`Tag with id ${tagId} not found`));

      await expect(controller.remove(tagId)).rejects.toThrow(NotFoundException);
    });

    it('should handle errors when removing a tag', async () => {
      const tagId = 1;
      const errorMessage = 'Error removing tag';

      jest.spyOn(service, 'remove').mockRejectedValue(new Error(errorMessage));

      await expect(controller.remove(tagId)).rejects.toThrow(errorMessage);
    });
  });
});