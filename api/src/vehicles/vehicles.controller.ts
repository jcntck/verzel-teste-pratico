import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueryOptions } from 'src/interface/query-options.interface';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { FindAndCountResponse, VehiclesService } from './vehicles.service';

@Controller('api/v1/vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  findAndCount(
    @Query() queryOptions: QueryOptions,
  ): Promise<FindAndCountResponse> {
    return this.vehiclesService.findAndCount(queryOptions);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: number): Promise<Vehicle | null> {
    return this.vehiclesService.findById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  create(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<void> {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number): Promise<void> {
    return this.vehiclesService.remove(id);
  }
}
