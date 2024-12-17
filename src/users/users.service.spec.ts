/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Companies } from '../companies/entities/company.entity';
import { Roles } from '../roles/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

jest.mock('bcrypt'); 

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockToken'),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const createUserDto: CreateUserDto = {
        company_id: 1,
        username: 'Test User',
        email: 'test@example.com',
        password: 'password',
        role_id: 1,
      };
      const hashedPassword = '$2b$15$tWe.F6bqCOA9ulmrd9VUbuD48gN8Z/i83anwyTYI3fkQgGVELnz22';
      const user: Users = {
        id: 1,
        ...createUserDto,
        password: hashedPassword,
        company: new Companies(),
        role: new Roles(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.create(createUserDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: Users[] = [
        {
          id: 1,
          username: 'Test User',
          company: new Companies(),
          role: new Roles(),
          created_at: new Date(),
          updated_at: new Date(),
          company_id: 0,
          email: '',
          password: '',
          role_id: 0,
          
        },
        {
          id: 2,
          username: 'Test User 2',
          company: new Companies(),
          role: new Roles(),
          created_at: new Date(),
          updated_at: new Date(),
          company_id: 0,
          email: '',
          password: '',
          role_id: 0,
        },
      ];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user: Users = {
        id: 1,
        username: 'Test User',
        company_id: 0,
        company: new Companies(),
        role: new Roles(),
        email: '',
        password: '',
        role_id: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(user);
    });

    it('should return undefined if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findOne(1);

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'Updated User' };
      const user = { id: 1, ...updateUserDto };

      mockUserRepository.preload.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.update(1, updateUserDto);

      expect(mockUserRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateUserDto,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.preload.mockResolvedValue(null);

      await expect(
        service.update(1, { username: 'Updated User' }),
      ).rejects.toThrow('User 1 not found');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = { id: 1, username: 'Test User' };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.remove.mockResolvedValue(user);

      const result = await service.remove(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should throw error if user to delete is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(2)).rejects.toThrow('User 2 not found');
    });
  });

  describe('login', () => {
    it('should return a user and token on successful login', async () => {
      const loginUserDto: LoginUserDto = { username: 'test', password: 'password' };
      const user: Users = {
        id: 1,
        username: 'test',
        email: 'test@example.com',
        password: '$2b$15$tWe.F6bqCOA9ulmrd9VUbuD48gN8Z/i83anwyTYI3fkQgGVELnz22',
        company_id: 1,
        role_id: 1,
        company: new Companies(),
        role: new Roles(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.login(loginUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username: 'test' } });
      expect(result).toEqual({ user, token: 'mockToken' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginUserDto: LoginUserDto = { username: 'test', password: 'wrongpassword' };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginUserDto)).rejects.toThrow('Error login');
    });
  });
});
