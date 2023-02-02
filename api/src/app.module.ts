import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { BrandsModule } from './brands/brands.module';
import { PostgresTypeOrmConfigFactory } from './config/postgres-typeorm.config';
import { UsersModule } from './users/users.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
