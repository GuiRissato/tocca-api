import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly repository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 15);
      const user = this.repository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return this.repository.save(user);
    } catch (error) {
      console.error('error creating user', error.message);
      throw 'error creating user' + error.message;
    }
  }

  findAll(): Promise<Users[]> {
    try {
      const allUsers = this.repository.find();
      return allUsers;
    } catch (error) {
      console.error('error finding users', error.message);
      throw 'error finding users' + error.message;
    }
  }

  findOne(id: number): Promise<Users> {
    try {
      const findOneUser = this.repository.findOne({ where: { id } });
      return findOneUser;
    } catch (error) {
      console.error('error finding one user', error.message);
      throw 'error finding one user' + error.message;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    try {
      const user = await this.repository.preload({
        id: id,
        ...updateUserDto,
      });

      if (!user) {
        throw new NotFoundException(`User ${id} not found`);
      }
      return this.repository.save(user);
    } catch (error) {
      console.error('error updating user', error.message);
      throw new NotFoundException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const userToDelete = await this.findOne(id);
      if (!userToDelete) {
        throw new NotFoundException(`User ${id} not found`);
      }
      return this.repository.remove(userToDelete);
    } catch (error) {
      console.error('error deleting user', error.message);
      throw new NotFoundException(error.message);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<{ user: Users, token: string }> {
    try {
      const { username, password } = loginUserDto;
      const user = await this.repository.findOne({ where: { username } });
  
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const payload = { username: user.username, sub: user.id };
      const token = this.jwtService.sign(payload);
      
      return { user, token };
    } catch (error) {
      console.error('Error login ', error.message)
      throw new Error('Error login')
    }
  }
}
