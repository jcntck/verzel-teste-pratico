import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandsService } from '../brands/brands.service';
import { Like, Repository } from 'typeorm';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { Model } from './entities/model.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { QueryOptions } from 'src/interface/query-options.interface';

export type FindAndCountResponse = {
  result: Model[];
  total: number;
};

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    private readonly brandsService: BrandsService,
  ) {}

  async findAndCount(query: QueryOptions): Promise<FindAndCountResponse> {
    const take = query.limit || 10;
    const skip = query.skip || 0;
    const keyword = query.search || '';

    const [result, total] = await this.modelRepository.findAndCount({
      where: [{ name: Like('%' + keyword + '%') }],
      order: { id: 'desc' },
      take,
      skip,
    });

    return { result, total };
  }

  async findAll(): Promise<Model[]> {
    return this.modelRepository.find({
      relations: {
        brand: true,
      },
      select: {
        id: true,
        name: true,
        brand: { id: true },
      },
    });
  }

  async findAllByBrand(brandId: number) {
    return this.modelRepository.find({
      where: { brand: { id: brandId } },
    });
  }

  async findByName(name: string): Promise<Model | null> {
    return this.modelRepository.findOne({
      where: {
        name,
      },
      relations: {
        brand: true,
      },
    });
  }

  async findById(id: number): Promise<Model | null> {
    return this.modelRepository.findOne({ where: { id } });
  }

  async tryFindBrandById(brandId: number): Promise<Brand> {
    const brand = await this.brandsService.findById(brandId);
    if (!brand) throw new NotFoundException('brand not found');
    return brand;
  }

  async create(createModelDto: CreateModelDto): Promise<Model> {
    const { brandId } = createModelDto;
    const brand = await this.tryFindBrandById(brandId);

    let model = await this.findByName(createModelDto.name);
    if (model && model.brand.id == createModelDto.brandId)
      throw new BadRequestException('model already exists');

    const newModel = new Model();
    newModel.name = createModelDto.name;
    newModel.brand = brand;

    return this.modelRepository.save(newModel);
  }

  async update(id: number, updateModelDto: UpdateModelDto): Promise<void> {
    const { brandId } = updateModelDto;
    const brand = await this.tryFindBrandById(brandId);

    const modelExists = await this.findByName(updateModelDto.name);
    if (modelExists && modelExists.id !== id)
      throw new BadRequestException('model already exists with this name');

    const response = await this.modelRepository.update(id, {
      name: updateModelDto.name,
      brand,
    });

    if (!response.affected) throw new NotFoundException('model not found');
  }

  async remove(id: number): Promise<void> {
    await this.modelRepository.delete(id);
  }
}
