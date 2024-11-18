import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Company } from '../companies/entities/company.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { mock } from 'node:test';

describe('RolesService', () => {
  let service: RolesService;
  let repository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const createRoleDto: CreateRoleDto = {
        role_name: 'Admin',
        company_id: 1,
      };
      const createRole: Role = {
        id: 1,
        ...createRoleDto,
        company: new Company(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'create').mockReturnValue(createRole);
      jest.spyOn(repository, 'save').mockResolvedValue(createRole);

      expect(await service.create(createRoleDto)).toEqual(createRole);
    });

    it('should throw a BadRequestException if creation fails', async () => {
      jest.spyOn(repository, 'create').mockImplementation(() => {
        throw new Error('Creation error');
      });
    
      await expect(service.create({ role_name: 'Admin', company_id: undefined })).rejects.toThrow(BadRequestException);
    });
    
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const companyId = 1;
      const mockRoles: Role[] = [
        {
          id: 1,
          role_name: 'Admin',
          company_id: companyId,
          company: new Company(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          role_name: 'User',
          company_id: companyId,
          company: new Company(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(mockRoles);

      expect(await service.findAll(companyId)).toEqual(mockRoles);
    });

    it('should throw a NotFoundException if no roles are found', async () => {
      const companyId = 1;
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      await expect(service.findAll(companyId)).rejects.toThrow('Roles not found for the given company_id No roles found');
    });
  });

  describe('findOne', () => {
    it('should return a role', async () => {
      const roleId = 1;
      const mockRole: Role = {
        id: roleId,
        role_name: 'Admin',
        company_id: 1,
        company: new Company(),
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockRole);

      expect(await service.findOne(roleId)).toEqual(mockRole);
    });

    it('should throw an error with a specific message if role is not found', async () => {
      const roleId = 999;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    
      await expect(service.findOne(roleId)).rejects.toThrow('Failed to retrieve the role');
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const roleId = 1;
      const updateRoleDto: UpdateRoleDto = { role_name: 'Manager' };
      const updatedRole: Role = {
        id: roleId,
        role_name: 'Manager',
        company_id: 1,
        company: new Company(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'preload').mockResolvedValue(updatedRole);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedRole);

      expect(await service.update(roleId, updateRoleDto)).toEqual(updatedRole);
    });

    it('should throw a NotFoundException if role is not found', async () => {
      const roleId = 1;
      const updateRoleDto: UpdateRoleDto = { role_name: 'Manager' };

      jest.spyOn(repository, 'preload').mockResolvedValue(undefined);

      await expect(service.update(roleId, updateRoleDto)).rejects.toThrow('Error updating role Role not found');
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const roleId = 1;
      const mockRole: Role = {
        id: roleId,
        role_name: 'Admin',
        company_id: 1,
        company: new Company(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockRole);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockRole);

      expect(await service.remove(roleId)).toEqual(mockRole);
    });

    it('should throw a NotFoundException if role is not found', async () => {
      const roleId = 1;

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.remove(roleId)).rejects.toThrow('Error deleting role Role not found');
    });
  });
});