import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './entities/role.entity'; // Adjust the import path as necessary
import { NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Company } from '../companies/entities/company.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const createRoleDto: CreateRoleDto = {
        role_name: 'Admin',
        company_id: 1,
      }; // Adjust the DTO properties as necessaryExample DTO
      const role: Role = {
        id: 1,
        ...createRoleDto,
        company: new Company(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'create').mockReturnValue(role);
      jest.spyOn(repository, 'save').mockResolvedValue(role);

      expect(await service.create(createRoleDto)).toEqual(role);
    });

    it('should throw an error if creation fails', async () => {
      const createRoleDto: CreateRoleDto = {
        role_name: 'Admin',
        company_id: 1,
      };

      jest.spyOn(repository, 'create').mockImplementation(() => {
        throw new Error('Creation error');
      });

      await expect(service.create(createRoleDto)).rejects.toThrow(
        'error creating new roleCreation error',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const roles: Role[] = [
        {
          id: 1,
          role_name: 'Admin',
          company: new Company(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          role_name: 'User',
          company: new Company(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(roles);

      expect(await service.findAll(1)).toEqual(roles);
    });

    it('should throw a NotFoundException if no roles are found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      await expect(service.findAll(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a role', async () => {
      const role: Role = {
        id: 1,
        role_name: 'Admin',
        company: new Company(),
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(role);

      expect(await service.findOne(1)).toEqual(role);
    });

    it('should throw a NotFoundException if role is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const roleId = 1;

      const updateRole: UpdateRoleDto = { role_name: 'admin' };

      const updatedRole: Role = {
        id: roleId,
        role_name: updateRole.role_name,
        company: new Company(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'preload').mockResolvedValue(updatedRole);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedRole);

      expect(await service.update(roleId, updateRole)).toEqual(updatedRole);
    });

    it('should throw a NotFoundException if role is not found', async () => {
      jest.spyOn(repository, 'preload').mockResolvedValue(undefined);

      await expect(service.update(1, { name: 'User' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const role = { id: 1, name: 'Admin' };

      jest.spyOn(service, 'findOne').mockResolvedValue(role as any);
      jest.spyOn(repository, 'remove').mockResolvedValue(role as any);

      expect(await service.remove(1)).toEqual(role);
    });

    it('should throw a NotFoundException if role is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
