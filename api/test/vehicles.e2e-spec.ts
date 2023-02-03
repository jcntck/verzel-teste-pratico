import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateVehicleDto } from 'src/vehicles/dto/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/vehicles/dto/update-vehicle.dto';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Brand } from '../src/brands/entities/brand.entity';
import { PostgresTypeOrmConfigFactory } from '../src/config/postgres-typeorm.config';
import { Model } from '../src/models/entities/model.entity';
import { Vehicle } from '../src/vehicles/entities/vehicle.entity';
import { VehiclesModule } from '../src/vehicles/vehicles.module';
import { VehiclesMock } from './mocks/vehicles.mock';

describe('Vehicles', () => {
  let app: INestApplication;
  let brandRepository: Repository<Brand>;
  let modelRepository: Repository<Model>;
  let vehicleRepository: Repository<Vehicle>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        VehiclesModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: PostgresTypeOrmConfigFactory,
          inject: [ConfigService],
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    brandRepository = module.get('BrandRepository');
    modelRepository = module.get('ModelRepository');
    vehicleRepository = module.get('VehicleRepository');

    const brand = await brandRepository.save({ name: 'Brand Vehicle Test' });
    const model = await modelRepository.save([
      { name: 'Model Vehicle Test', brand },
      { name: 'Model Vehicle Test 1', brand },
    ]);

    VehiclesMock.CREATE_MODELID = model[0].id;
    VehiclesMock.UPDATE_MODELID = model[1].id;
  });

  describe('/POST Vehicles', () => {
    it('deve criar um veículo com sucesso', () => {
      const createVehicleDto: CreateVehicleDto = VehiclesMock.create();

      return request(app.getHttpServer())
        .post('/vehicles')
        .send(createVehicleDto)
        .expect(201);
    });

    it('deve retornar erro de modelo não encontrada', () => {
      const createVehicleDto: CreateVehicleDto = VehiclesMock.create();
      createVehicleDto.modelId = 50;

      return request(app.getHttpServer())
        .post('/vehicles')
        .send(createVehicleDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'model not found',
          error: 'Not Found',
        });
    });
  });

  describe('/PUT Vehicles', () => {
    it('deve retornar erro de vehicle não encontrado', () => {
      const updateVehicleDto: UpdateVehicleDto = VehiclesMock.update();
      return request(app.getHttpServer())
        .put(`/vehicles/1256`)
        .send(updateVehicleDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'vehicle not found',
          error: 'Not Found',
        });
    });

    it('deve retornar erro de modelo não encontrada', async () => {
      const updateVehicleDto: UpdateVehicleDto = VehiclesMock.update();
      updateVehicleDto.modelId = 50;

      const vehicle = <Vehicle>await vehicleRepository.findOne({
        where: {
          name: VehiclesMock.CREATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .put(`/vehicles/${vehicle.id}`)
        .send(updateVehicleDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'model not found',
          error: 'Not Found',
        });
    });

    it('deve atualizar as informações do veículo', async () => {
      const updateVehicleDto: UpdateVehicleDto = VehiclesMock.update();

      const vehicle = <Vehicle>await vehicleRepository.findOne({
        where: {
          name: VehiclesMock.CREATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .put(`/vehicles/${vehicle.id}`)
        .send(updateVehicleDto)
        .expect(200);
    });
  });

  describe('/GET Vehicles', () => {
    it('deve retornar uma lista de veículos', async () => {
      return request(app.getHttpServer())
        .get('/vehicles')
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('deve retornar um veículo pelo pelo id', async () => {
      const vehicle = <Vehicle>await vehicleRepository.findOne({
        where: {
          name: VehiclesMock.UPDATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .get(`/vehicles/${vehicle.id}`)
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('/DELETE Vehicles', () => {
    it('deve remover um veículo', async () => {
      const vehicle = <Vehicle>await vehicleRepository.findOne({
        where: {
          name: VehiclesMock.UPDATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .delete(`/vehicles/${vehicle.id}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await modelRepository.query(
      "DELETE FROM models WHERE name IN ('Model Vehicle Test', 'Model Vehicle Test 1')",
    );
    await brandRepository.query(
      "DELETE FROM brands WHERE name = 'Brand Vehicle Test'",
    );
    await app.close();
  });
});
