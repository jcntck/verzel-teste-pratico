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
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { Model } from './entities/model.entity';
import { FindAndCountResponse, ModelsService } from './models.service';

@Controller('api/v1/models')
@UseGuards(JwtAuthGuard)
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  findAndCount(
    @Query() queryOptions: QueryOptions,
  ): Promise<FindAndCountResponse> {
    return this.modelsService.findAndCount(queryOptions);
  }

  @Get('all')
  findAll(): Promise<Model[]> {
    return this.modelsService.findAll();
  }

  @Get(':brandId/all')
  findAllByBrands(@Param('brandId') brandId: number): Promise<Model[]> {
    return this.modelsService.findAllByBrand(brandId);
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Model | null> {
    return this.modelsService.findById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createModelDto: CreateModelDto): Promise<Model> {
    return this.modelsService.create(createModelDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: number,
    @Body() updateModelDto: UpdateModelDto,
  ): Promise<void> {
    return this.modelsService.update(id, updateModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.modelsService.remove(id);
  }
}
