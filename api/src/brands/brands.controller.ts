import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Controller('api/v1/brands')
@UseGuards(JwtAuthGuard)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandsService.create(createBrandDto);
  }

  @Patch(':id/icon')
  @UsePipes(ValidationPipe)
  uploadIcon(
    @Param('id') id: number,
    @Body('iconPath') iconPath: string | null,
  ): Promise<void> {
    return this.brandsService.saveIconPath(id, iconPath);
  }

  @Get()
  findAll(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Brand | null> {
    return this.brandsService.findById(id);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: number,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<void> {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.brandsService.remove(id);
  }
}
