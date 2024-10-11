/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';

const mockCompanyRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
};

describe('CompanyService', () => {
  let service: CompanyService;
  let repository: Repository<Company>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    repository = module.get<Repository<Company>>(getRepositoryToken(Company));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a new company', async () => {
      const createCompanyDto = {
        company_name: 'Test Company',
        description: 'company 1',
      };
      const company = { id: 1, ...createCompanyDto };

      mockCompanyRepository.create.mockReturnValue(company);
      mockCompanyRepository.save.mockResolvedValue(company);

      const result = await service.create(createCompanyDto);

      expect(mockCompanyRepository.create).toHaveBeenCalledWith(
        createCompanyDto,
      );
      expect(mockCompanyRepository.save).toHaveBeenCalledWith(company);
      expect(result).toEqual(company);
    });
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      const companies = [{ id: 1, name: 'Test Company' }];
      mockCompanyRepository.find.mockResolvedValue(companies);

      const result = await service.findAll();

      expect(mockCompanyRepository.find).toHaveBeenCalled();
      expect(result).toEqual(companies);
    });
  });

  describe('findOne', () => {
    it('should return a company by ID', async () => {
      const company = { id: 1, name: 'Test Company' };
      mockCompanyRepository.findOne.mockResolvedValue(company);

      const result = await service.findOne(1);

      expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(company);
    });

    it('should return undefined if company not found', async () => {
      mockCompanyRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findOne(1);

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const updateCompanyDto = {
        name: 'Updated Company',
        description: 'updated company',
      };
      const company = { id: 1, ...updateCompanyDto };

      mockCompanyRepository.preload.mockResolvedValue(company);
      mockCompanyRepository.save.mockResolvedValue(company);

      const result = await service.update(1, updateCompanyDto);

      expect(mockCompanyRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateCompanyDto,
      });
      expect(mockCompanyRepository.save).toHaveBeenCalledWith(company);
      expect(result).toEqual(company);
    });

    it('should throw NotFoundException if company not found', async () => {
      mockCompanyRepository.preload.mockResolvedValue(null);

      await expect(
        service.update(1, { company_name: 'Updated Company' }),
      ).rejects.toThrow('Company 1 not found');
    });
  });

  describe('remove', () => {
    it('should remove a company', async () => {
      const company = { id: 1, name: 'Test Company' };
      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockCompanyRepository.remove.mockResolvedValue(company);

      const result = await service.remove(1);

      expect(mockCompanyRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockCompanyRepository.remove).toHaveBeenCalledWith(company);
      expect(result).toEqual(company);
    });
  });
});
