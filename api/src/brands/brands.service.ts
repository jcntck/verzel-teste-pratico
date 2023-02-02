import { BadRequestException, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  async findAll(): Promise<Brand[]> {
    return this.brandsRepository.find();
  }

  async findById(id: number): Promise<Brand | null> {
    return this.brandsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByName(name: string): Promise<Brand | null> {
    return this.brandsRepository.findOne({
      where: {
        name,
      },
    });
  }

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brand = await this.findByName(createBrandDto.name);
    if (brand) throw new BadRequestException('brand already exists');

    return this.brandsRepository.save(createBrandDto);
  }

  async saveIconPath(id: number, iconPath: string | null): Promise<void> {
    const response = await this.brandsRepository.update(id, {
      iconPath,
    });

    if (!response.affected) throw new NotFoundException('brand not found');
  }

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<void> {
    const brand = await this.findByName(updateBrandDto.name);
    if (brand && brand.id !== id)
      throw new BadRequestException('brand already exists with this name');

    const response = await this.brandsRepository.update(id, updateBrandDto);

    if (!response.affected) throw new NotFoundException('brand not found');
  }

  async remove(id: number): Promise<void> {
    await this.brandsRepository.delete(id);
  }
}
