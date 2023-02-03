import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { Model } from './entities/model.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/models')
@UseGuards(JwtAuthGuard)
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  findAll(): Promise<Model[]> {
    return this.modelsService.findAll();
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
