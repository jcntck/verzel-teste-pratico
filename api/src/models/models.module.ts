import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { BrandsModule } from './../brands/brands.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Model]), BrandsModule],
  controllers: [ModelsController],
  providers: [ModelsService],
})
export class ModelsModule {}
