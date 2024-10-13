import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.repository.create(createUserDto);
      return this.repository.save(user);
    } catch (error) {
      console.log('error creating user', error.message);
      throw 'error creating user' + error.message;
    }
  }

  findAll(): Promise<User[]> {
    try {
      const allUsers = this.repository.find();
      return allUsers;
    } catch (error) {
      console.log('error finding users', error.message);
      throw 'error finding users' + error.message;
    }
  }

  findOne(id: number): Promise<User> {
    try {
      const findOneUser = this.repository.findOne({ where: { id } });
      return findOneUser;
    } catch (error) {
      console.log('error finding one user', error.message);
      throw 'error finding one user' + error.message;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
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
      console.log('error updating user', error.message);
      throw new NotFoundException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const userToDelete = await this.findOne(parseInt(id));
      if (!userToDelete) {
        throw new NotFoundException(`User ${id} not found`);
      }
      return this.repository.remove(userToDelete);
    } catch (error) {
      console.log('error deleting user', error.message);
      throw new NotFoundException(error.message);
    }
  }
}
