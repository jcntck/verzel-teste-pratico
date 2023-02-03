import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { PostgresTypeOrmConfigFactory } from './config/postgres-typeorm.config';
import { ModelsModule } from './models/models.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';

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
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
