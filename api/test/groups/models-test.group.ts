import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import { Brand } from '../../src/brands/entities/brand.entity';
import { PostgresTypeOrmConfigFactory } from '../../src/config/postgres-typeorm.config';
import { CreateModelDto } from '../../src/models/dto/create-model.dto';
import { UpdateModelDto } from '../../src/models/dto/update-model.dto';
import { Model } from '../../src/models/entities/model.entity';
import { ModelsModule } from '../../src/models/models.module';
import { User } from '../../src/users/entities/user.entity';
import { ModelsMock } from '../mocks/models.mock';

export default () => {
  let app: INestApplication;
  let modelRepository: Repository<Model>;
  let brandRepository: Repository<Brand>;
  let userRepository: Repository<User>;
  let authService: AuthService;
  let access_token: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
        ModelsModule,
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

    const brands = await brandRepository.save([
      { name: 'Volkswagen Models Test' },
      { name: 'Fiat Models Test' },
    ]);

    ModelsMock.CREATE_BRANDID = brands[0].id;
    ModelsMock.UPDATE_BRANDID = brands[1].id;

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

  describe('/POST Models', () => {
    it('deve criar um modelo com sucesso', () => {
      const createModelDto: CreateModelDto = ModelsMock.create();

      return request(app.getHttpServer())
        .post('/api/v1/models')
        .set('Authorization', `Bearer ${access_token}`)
        .send(createModelDto)
        .expect(201);
    });

    it('deve retornar erro de modelo já existe', () => {
      const createModelDto: CreateModelDto = ModelsMock.create();

      return request(app.getHttpServer())
        .post('/api/v1/models')
        .set('Authorization', `Bearer ${access_token}`)
        .send(createModelDto)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'model already exists',
          error: 'Bad Request',
        });
    });

    it('deve retornar erro de marca não encontrada', () => {
      const createModelDto: CreateModelDto = ModelsMock.create();
      createModelDto.brandId = 50;

      return request(app.getHttpServer())
        .post('/api/v1/models')
        .set('Authorization', `Bearer ${access_token}`)
        .send(createModelDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'brand not found',
          error: 'Not Found',
        });
    });
  });

  describe('/PUT Models', () => {
    it('deve retornar erro de modelo não encontrado', () => {
      const updateModelDto: UpdateModelDto = ModelsMock.update();
      return request(app.getHttpServer())
        .put(`/api/v1/models/1256`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(updateModelDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'model not found',
          error: 'Not Found',
        });
    });

    it('deve retornar erro de marca não encontrada', async () => {
      const updateModelDto: UpdateModelDto = ModelsMock.update();
      updateModelDto.brandId = 50;

      const model = <Model>await modelRepository.findOne({
        where: {
          name: ModelsMock.CREATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .put(`/api/v1/models/${model.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(updateModelDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'brand not found',
          error: 'Not Found',
        });
    });

    it('deve atualizar as informações do modelo', async () => {
      const updateModelDto: UpdateModelDto = ModelsMock.update();

      const model = <Model>await modelRepository.findOne({
        where: {
          name: ModelsMock.CREATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .put(`/api/v1/models/${model.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(updateModelDto)
        .expect(200);
    });
  });

  describe('/GET Models', () => {
    it('deve retornar uma lista de modelos', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/models')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('deve retornar um modelo pelo pelo id', async () => {
      const model = <Model>await modelRepository.findOne({
        where: {
          name: ModelsMock.UPDATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .get(`/api/v1/models/${model.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('/DELETE Models', () => {
    it('deve remover um modelo', async () => {
      const model = <Model>await modelRepository.findOne({
        where: {
          name: ModelsMock.UPDATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .delete(`/api/v1/models/${model.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await brandRepository.query(
      "DELETE FROM brands WHERE name IN ('Volkswagen Models Test', 'Fiat Models Test')",
    );
    await userRepository.query(
      `DELETE FROM users WHERE email = 'admin_test@e2e.com'`,
    );
    await app.close();
  });
};
