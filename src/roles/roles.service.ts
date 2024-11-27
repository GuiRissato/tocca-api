import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles) private repository: Repository<Roles>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Roles> {
    try {
      const newRole = this.repository.create(createRoleDto);
      return await this.repository.save(newRole);
    } catch (error) {
      console.error('Error creating new role', error.message);
      throw new BadRequestException('Error creating new role: ' + error.message);
    }
  }

  async findAll(companyId: number): Promise<Roles[]> {
    try {
      const roles = await this.repository.find({
        where: { company_id: companyId },
      });

      if (roles.length === 0) {
        throw new NotFoundException('No roles found');
      }

      return roles;
    } catch (error) {
      console.error('Error finding roles by company_id', error.message);
      throw new Error(
        'Roles not found for the given company_id ' + error.message,
      );
    }
  }

  async findOne(id: number): Promise<Roles> {
    try {
      const role = await this.repository.findOne({ where: { id: id } });

      if (!role) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }
    
      return role;
    } catch (error) {
      console.error('error finding role', error.message);
      throw new Error('Failed to retrieve the role');
    }
  }

  async update( id: number, updateRoleDto: UpdateRoleDto ): Promise<Roles> {
    try {
      const role = await this.repository.preload({
        id: id,
        ...updateRoleDto,
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return this.repository.save(role);
    } catch (error) {
      console.error('error updating role', error.message);
      throw new Error('Error updating role ' + error.message);
    }
  }


  async remove(id: number): Promise<Roles> {
    try {
      const role = await this.findOne(id);
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return this.repository.remove(role);
    } catch (error) {
      console.error('error deleting role', error.message);
      throw new Error('Error deleting role ' + error.message);
    }
  }
}
