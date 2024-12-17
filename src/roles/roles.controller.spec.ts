import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from './entities/role.entity';
import { NotFoundException } from '@nestjs/common';
import { Companies } from '../companies/entities/company.entity';

const mockRolesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const createRoleDto: CreateRoleDto = { role_name: 'Admin', company_id: 1 };
      const createdRole: Roles = {
        id: 1, ...createRoleDto, created_at: new Date(), updated_at: new Date(),
        company: new Companies()
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdRole);

      const result = await controller.create(createRoleDto);
      expect(result).toEqual(createdRole);
    });

    it('should handle errors when creating a role', async () => {
      const createRoleDto: CreateRoleDto = { role_name: 'Admin', company_id: 1 };
      const errorMessage = 'Error creating role';

      jest.spyOn(service, 'create').mockRejectedValue(new Error(errorMessage));

      await expect(controller.create(createRoleDto)).rejects.toThrow(errorMessage);
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const roles: Roles[] = [{
        id: 1, role_name: 'Admin', company_id: 1, created_at: new Date(), updated_at: new Date(),
        company: new Companies()
      },
      {
        id: 2, role_name: 'manager', company_id: 1, created_at: new Date(), updated_at: new Date(),
        company: new Companies()
      }];

      jest.spyOn(service, 'findAll').mockResolvedValue(roles);

      const result = await controller.findAll(1);
      expect(result).toEqual(roles);
    });
  });

  describe('findOne', () => {
    it('should return a role', async () => {
      const role: Roles = {
        id: 1, role_name: 'Admin', company_id: 1, created_at: new Date(), updated_at: new Date(),
        company: new Companies()
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(role);

      const result = await controller.findOne('1');
      expect(result).toEqual(role);
    });

    it('should throw NotFoundException if role not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Role not found'));

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const updateRoleDto: UpdateRoleDto = { role_name: 'User' };
      const updatedRole: Roles = {
        id: 1, role_name: 'User', company_id: 1, created_at: new Date(), updated_at: new Date(),
        company: new Companies()
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedRole);

      const result = await controller.update(1, updateRoleDto);
      expect(result).toEqual(updatedRole);
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const role: Roles = {
        id: 1, role_name: 'Admin', company_id: 1, created_at: new Date(), updated_at: new Date(),
        company: new Companies()
      };

      jest.spyOn(service, 'remove').mockResolvedValue(role);

      const result = await controller.remove(1);
      expect(result).toEqual(role);
    });
  });
});
