import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateVehicleDto } from 'src/vehicles/dto/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/vehicles/dto/update-vehicle.dto';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import { Brand } from '../../src/brands/entities/brand.entity';
import { PostgresTypeOrmConfigFactory } from '../../src/config/postgres-typeorm.config';
import { Model } from '../../src/models/entities/model.entity';
import { User } from '../../src/users/entities/user.entity';
import { Vehicle } from '../../src/vehicles/entities/vehicle.entity';
import { VehiclesModule } from '../../src/vehicles/vehicles.module';
import { VehiclesMock } from '../mocks/vehicles.mock';

export default () => {
  let app: INestApplication;
  let brandRepository: Repository<Brand>;
  let modelRepository: Repository<Model>;
  let vehicleRepository: Repository<Vehicle>;
  let userRepository: Repository<User>;
  let authService: AuthService;
  let access_token: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
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

    userRepository = module.get('UserRepository');
    authService = module.get<AuthService>(AuthService);

    const admin = await userRepository.save({
      name: 'Admin Test E2E',
      email: 'admin_test@e2e.com',
      password: 'admin_password',
    });

    const response = await authService.login(admin);
    access_token = response.access_token;
  });

  describe('/POST Vehicles', () => {
    it('deve criar um ve??culo com sucesso', () => {
      const createVehicleDto: CreateVehicleDto = VehiclesMock.create();

      return request(app.getHttpServer())
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${access_token}`)
        .send(createVehicleDto)
        .expect(201);
    });

    it('deve retornar erro de modelo n??o encontrada', () => {
      const createVehicleDto: CreateVehicleDto = VehiclesMock.create();
      createVehicleDto.modelId = 50;

      return request(app.getHttpServer())
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${access_token}`)
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
    it('deve retornar erro de vehicle n??o encontrado', () => {
      const updateVehicleDto: UpdateVehicleDto = VehiclesMock.update();
      return request(app.getHttpServer())
        .put(`/api/v1/vehicles/1256`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(updateVehicleDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'vehicle not found',
          error: 'Not Found',
        });
    });

    it('deve retornar erro de modelo n??o encontrada', async () => {
      const updateVehicleDto: UpdateVehicleDto = VehiclesMock.update();
      updateVehicleDto.modelId = 50;

      const vehicle = <Vehicle>await vehicleRepository.findOne({
        where: {
          name: VehiclesMock.CREATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .put(`/api/v1/vehicles/${vehicle.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(updateVehicleDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'model not found',
          error: 'Not Found',
        });
    });

    it('deve atualizar as informa????es do ve??culo', async () => {
      const updateVehicleDto: UpdateVehicleDto = VehiclesMock.update();

      const vehicle = <Vehicle>await vehicleRepository.findOne({
        where: {
          name: VehiclesMock.CREATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .put(`/api/v1/vehicles/${vehicle.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(updateVehicleDto)
        .expect(200);
    });
  });

  describe('/GET Vehicles', () => {
    it('deve retornar uma lista de ve??culos', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/vehicles')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('deve retornar um ve??culo pelo pelo id', async () => {
      const vehicle = <Vehicle>await vehicleRepository.findOne({
        where: {
          name: VehiclesMock.UPDATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .get(`/api/v1/vehicles/${vehicle.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('/DELETE Vehicles', () => {
    it('deve remover um ve??culo', async () => {
      const vehicle = <Vehicle>await vehicleRepository.findOne({
        where: {
          name: VehiclesMock.UPDATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .delete(`/api/v1/vehicles/${vehicle.id}`)
        .set('Authorization', `Bearer ${access_token}`)
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
    await userRepository.query(
      `DELETE FROM users WHERE email = 'admin_test@e2e.com'`,
    );
    await app.close();
  });
};
