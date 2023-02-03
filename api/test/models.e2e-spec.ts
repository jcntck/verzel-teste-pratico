import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Brand } from '../src/brands/entities/brand.entity';
import { PostgresTypeOrmConfigFactory } from '../src/config/postgres-typeorm.config';
import { CreateModelDto } from '../src/models/dto/create-model.dto';
import { UpdateModelDto } from '../src/models/dto/update-model.dto';
import { Model } from '../src/models/entities/model.entity';
import { ModelsModule } from '../src/models/models.module';
import { ModelsMock } from './mocks/models.mock';

describe('Models', () => {
  let app: INestApplication;
  let modelRepository: Repository<Model>;
  let brandRepository: Repository<Brand>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
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
      { name: 'Volkswagen Test' },
      { name: 'Fiat Test' },
    ]);

    ModelsMock.CREATE_BRANDID = brands[0].id;
    ModelsMock.UPDATE_BRANDID = brands[1].id;
  });

  describe('/POST Models', () => {
    it('deve criar um modelo com sucesso', () => {
      const createModelDto: CreateModelDto = ModelsMock.create();

      return request(app.getHttpServer())
        .post('/models')
        .send(createModelDto)
        .expect(201);
    });

    it('deve retornar erro de modelo já existe', () => {
      const createModelDto: CreateModelDto = ModelsMock.create();

      return request(app.getHttpServer())
        .post('/models')
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
        .post('/models')
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
        .put(`/models/1256`)
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
        .put(`/models/${model.id}`)
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
        .put(`/models/${model.id}`)
        .send(updateModelDto)
        .expect(200);
    });
  });

  describe('/GET Models', () => {
    it('deve retornar uma lista de modelos', async () => {
      return request(app.getHttpServer())
        .get('/models')
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
        .get(`/models/${model.id}`)
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
        .delete(`/models/${model.id}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await brandRepository.query(
      "DELETE FROM brands WHERE name IN ('Volkswagen Test', 'Fiat Test')",
    );
    await app.close();
  });
});
