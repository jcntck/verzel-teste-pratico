import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const selectFields = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: selectFields,
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: selectFields,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        email,
      },
      select: selectFields,
    });
  }

  async create(userDto: CreateUserDto): Promise<User> {
    if (await this.findByEmail(userDto.email)) {
      throw new BadRequestException('user already exists with this email');
    }

    return this.userRepository.save(userDto);
  }

  async update(id: number, userDto: UpdateUserDto): Promise<void> {
    const user = await this.findByEmail(userDto.email);
    if (user && user.id !== id)
      throw new BadRequestException('user already exists with this email');

    const response: UpdateResult = await this.userRepository.update(
      id,
      userDto,
    );

    if (!response.affected) throw new NotFoundException('user not found');
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
