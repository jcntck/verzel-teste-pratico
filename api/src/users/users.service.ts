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
    });
  }

  async checkPassword(id: number, password: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    return user.checkPassword(password);
  }

  async create(userDto: CreateUserDto): Promise<User> {
    if (await this.findByEmail(userDto.email)) {
      throw new BadRequestException('user already exists with this email');
    }

    const newUser = new User();

    newUser.name = userDto.name;
    newUser.email = userDto.email;
    await newUser.encryptPassword(userDto.password);

    return this.userRepository.save(newUser);
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

  async updatePassword(id: number, password: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');

    await user.encryptPassword(password);
    await this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
