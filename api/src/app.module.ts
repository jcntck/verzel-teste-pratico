import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { BrandsModule } from './brands/brands.module';
import { PostgresTypeOrmConfigFactory } from './config/postgres-typeorm.config';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ModelsModule } from './models/models.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: PostgresTypeOrmConfigFactory,
      inject: [ConfigService],
    }),
    UsersModule,
    BrandsModule,
    VehiclesModule,
    ModelsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
