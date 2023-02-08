import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { QueryOptions } from 'src/interface/query-options.interface';
import { Model } from 'src/models/entities/model.entity';
import {
  DataSource,
  FindOptionsOrder,
  ILike,
  Like,
  Not,
  Repository,
} from 'typeorm';
import { ModelsService } from './../models/models.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

export type FindAndCountResponse = {
  result: Vehicle[];
  total: number;
};

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly modelsService: ModelsService,
  ) {}

  async findAndCount(query: QueryOptions): Promise<FindAndCountResponse> {
    const take = query.limit || 10;
    const skip = query.skip || 0;
    const keyword = query.search || '';

    const [result, total] = await this.vehicleRepository.findAndCount({
      where: [
        { name: ILike('%' + keyword + '%') },
        { model: { name: ILike('%' + keyword + '%') } },
        { model: { brand: { name: ILike('%' + keyword + '%') } } },
      ],
      order: {
        [query.sort || 'id']: query.order || 'desc',
      },
      relations: {
        model: { brand: true },
      },
      take,
      skip,
    });

    return { result, total };
  }

  async findById(id: number): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({
      where: {
        id,
      },
    });
  }

  async tryFindModelById(modelId: number): Promise<Model> {
    const model = await this.modelsService.findById(modelId);
    if (!model) throw new NotFoundException('model not found');
    return model;
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const { modelId } = createVehicleDto;
    const model = await this.tryFindModelById(modelId);

    return this.vehicleRepository.save({
      ...createVehicleDto,
      model,
    });
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<void> {
    const { modelId } = updateVehicleDto;
    const model = await this.tryFindModelById(modelId);

    const response = await this.vehicleRepository.update(id, {
      name: updateVehicleDto.name,
      photoPath: updateVehicleDto.photoPath,
      price: updateVehicleDto.price,
      model,
    });

    if (!response.affected) throw new NotFoundException('vehicle not found');
  }

  async remove(id: number): Promise<void> {
    await this.vehicleRepository.delete(id);
  }
}
