/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompaniesService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

const mockCompanyService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompaniesService,
          useValue: mockCompanyService,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompaniesService>(CompaniesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call CompanyService.create with the correct values', async () => {
      const createCompanyDto: CreateCompanyDto = {
        company_name: 'New Company',
        description: 'new company 1',
      };
      const createdCompany = { id: 1, ...createCompanyDto };
      mockCompanyService.create.mockResolvedValue(createdCompany);

      const result = await controller.create(createCompanyDto);

      expect(mockCompanyService.create).toHaveBeenCalledWith(createCompanyDto);
      expect(result).toEqual(createdCompany);
    });
  });

  describe('findAll', () => {
    it('should call CompanyService.findAll and return all companies', async () => {
      const companies = [{ id: 1, name: 'Test Company' }];
      mockCompanyService.findAll.mockResolvedValue(companies);

      const result = await controller.findAll();

      expect(mockCompanyService.findAll).toHaveBeenCalled();
      expect(result).toEqual(companies);
    });
  });

  describe('findOne', () => {
    it('should call CompanyService.findOne with the correct id', async () => {
      const company = { id: 1, name: 'Test Company' };
      mockCompanyService.findOne.mockResolvedValue(company);

      const result = await controller.findOne(1);

      expect(mockCompanyService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(company);
    });
  });

  describe('update', () => {
    it('should call CompanyService.update with the correct id and values', async () => {
      const updateCompanyDto: UpdateCompanyDto = {
        company_name: 'Updated Company',
        description: 'updated company',
      };
      const updatedCompany = { id: 1, ...updateCompanyDto };
      mockCompanyService.update.mockResolvedValue(updatedCompany);

      const result = await controller.update(1, updateCompanyDto);

      expect(mockCompanyService.update).toHaveBeenCalledWith(
        1,
        updateCompanyDto,
      );
      expect(result).toEqual(updatedCompany);
    });
  });

  describe('remove', () => {
    it('should call CompanyService.remove with the correct id', async () => {
      const removedCompany = { id: 1, name: 'Test Company' };
      mockCompanyService.remove.mockResolvedValue(removedCompany);

      const result = await controller.remove(1);

      expect(mockCompanyService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(removedCompany);
    });
  });
});
