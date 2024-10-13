import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private readonly repository: Repository<Company>,
  ) {}
  create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const company = this.repository.create(createCompanyDto);
      return this.repository.save(company);
    } catch (error) {
      console.log('error creating new company', error.message);
      throw error;
    }
  }

  findAll(): Promise<Company[]> {
    try {
      const allCompanies = this.repository.find();
      return allCompanies;
    } catch (error) {
      console.log('error finding all companies', error.message);
    }
  }

  findOne(id: number): Promise<Company> {
    try {
      const findOneCompany = this.repository.findOne({ where: { id } });
      return findOneCompany;
    } catch (error) {
      console.log('error finding company', error.message);
    }
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
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
      console.log('error updating company', error.message);
      throw new NotFoundException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const company = await this.findOne(id);
      return this.repository.remove(company);
    } catch (error) {
      console.log('error deleting company', error.message);
    }
  }
}
