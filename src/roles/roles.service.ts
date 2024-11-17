import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly repository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const role = this.repository.create(createRoleDto);
      return this.repository.save(role);
    } catch (error) {
      console.error('error creating new role', error.message);
      throw 'error creating new role' + error.message;
    }
  }

  async findAll(companyId: number): Promise<Role[]> {
    try {
      const roles = await this.repository.find({
        where: { company: { id: companyId } },
      });
      return roles;
    } catch (error) {
      console.error('Error finding roles by company_id', error.message);
      throw new NotFoundException(
        'Roles not found for the given company_id' + error.message,
      );
    }
  }

  findOne(id: number): Promise<Role> {
    try {
      const role = this.repository.findOne({ where: { id } });
      return role;
    } catch (error) {
      console.error('error finding role', error.message);
      throw new NotFoundException('Role not found' + error.message);
    }
  }

  async update( id: number, updateRoleDto: UpdateRoleDto ): Promise<Role> {
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
      throw new NotFoundException('Error updating role' + error.message);
    }
  }


  async remove(id: number): Promise<Role> {
    try {
      const role = await this.findOne(id);
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return this.repository.remove(role);
    } catch (error) {
      console.error('error deleting role', error.message);
      throw new NotFoundException('Error deleting role' + error.message);
    }
  }
}
