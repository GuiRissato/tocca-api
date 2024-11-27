import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Companies } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Companies) private readonly repository: Repository<Companies>,
  ) {}
  create(createCompanyDto: CreateCompanyDto): Promise<Companies> {
    try {
      const company = this.repository.create(createCompanyDto);
      return this.repository.save(company);
    } catch (error) {
      console.error('error creating new company', error.message);
      throw 'error creating new company' + error.message;
    }
  }

  findAll(): Promise<Companies[]> {
    try {
      const allCompanies = this.repository.find();
      return allCompanies;
    } catch (error) {
      console.error('error finding all companies', error.message);
    }
  }

  findOne(id: number): Promise<Companies> {
    try {
      const findOneCompany = this.repository.findOne({ where: { id } });
      return findOneCompany;
    } catch (error) {
      console.error('error finding company', error.message);
    }
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Companies> {
    try {
      const company = await this.repository.preload({
        id: id,
        ...updateCompanyDto,
      });
      if (!company) {
        throw new NotFoundException(`Company ${id} not found`);
      }
      return this.repository.save(company);
    } catch (error) {
      console.error('error updating company', error.message);
      throw new NotFoundException(error.message);
    }
  }

  async remove(id: number): Promise<Companies> {
    try {
      const company = await this.findOne(id);
      return this.repository.remove(company);
    } catch (error) {
      console.error('error deleting company', error.message);
    }
  }
}
