import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueryOptions } from 'src/interface/query-options.interface';
import { BrandsService, FindAndCountResponse } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Controller('api/v1/brands')
@ApiTags('Brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandsService.create(createBrandDto);
  }

  @Patch(':id/icon')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  uploadIcon(
    @Param('id') id: number,
    @Body('iconPath') iconPath: string | null,
  ): Promise<void> {
    return this.brandsService.saveIconPath(id, iconPath);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAndCount(
    @Query() queryOptions: QueryOptions,
  ): Promise<FindAndCountResponse> {
    return this.brandsService.findAndCount(queryOptions);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  @Get('all/vehicles')
  findAllWithVehicles(): Promise<Brand[]> {
    return this.brandsService.findAllWithVehicles();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findById(@Param('id') id: number): Promise<Brand | null> {
    return this.brandsService.findById(id);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: number,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<void> {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: number): Promise<void> {
    return this.brandsService.remove(id);
  }
}
