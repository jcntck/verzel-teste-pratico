import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'src/models/entities/model.entity';
import { Not, Repository } from 'typeorm';
import { ModelsService } from './../models/models.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly modelsService: ModelsService,
  ) {}

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find();
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
      model,
    });

    if (!response.affected) throw new NotFoundException('vehicle not found');
  }

  async remove(id: number): Promise<void> {
    await this.vehicleRepository.delete(id);
  }
}
