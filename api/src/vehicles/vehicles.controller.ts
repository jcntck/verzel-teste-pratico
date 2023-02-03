import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  findAll(): Promise<Vehicle[]> {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Vehicle | null> {
    return this.vehiclesService.findById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<void> {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.vehiclesService.remove(id);
  }
}
