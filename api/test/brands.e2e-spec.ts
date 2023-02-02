import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateBrandDto } from 'src/brands/dto/update-brand.dto';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { BrandsModule } from '../src/brands/brands.module';
import { CreateBrandDto } from '../src/brands/dto/create-brand.dto';
import { Brand } from '../src/brands/entities/brand.entity';
import { PostgresTypeOrmConfigFactory } from '../src/config/postgres-typeorm.config';
import { BrandsMock } from './mocks/brands.mock';

describe('Brands', () => {
  let app: INestApplication;
  let repository: Repository<Brand>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        BrandsModule,
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

    repository = module.get('BrandRepository');
  });

  describe('/POST Brands', () => {
    it('deve criar uma marca com sucesso', () => {
      const createBrandDto: CreateBrandDto = BrandsMock.create();

      return request(app.getHttpServer())
        .post('/brands')
        .send(createBrandDto)
        .expect(201);
    });

    it('deve retornar erro de marca já existe', () => {
      const createBrandDto: CreateBrandDto = BrandsMock.create();

      return request(app.getHttpServer())
        .post('/brands')
        .send(createBrandDto)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'brand already exists',
          error: 'Bad Request',
        });
    });
  });

  describe('/PUT Brands', () => {
    it('deve retornar erro de marca não encontrado', () => {
      const updateBrandDto: UpdateBrandDto = BrandsMock.update();

      return request(app.getHttpServer())
        .put(`/brands/1256`)
        .send(updateBrandDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'brand not found',
          error: 'Not Found',
        });
    });

    it('deve atualizar as informações da marca', async () => {
      const brand = <Brand>await repository.findOne({
        where: {
          name: 'Volkswagen',
        },
      });

      const updateBrandDto: UpdateBrandDto = BrandsMock.update();

      return request(app.getHttpServer())
        .put(`/brands/${brand.id}`)
        .send(updateBrandDto)
        .expect(200);
    });

    it('deve retornar um erro de nome já utilizado', async () => {
      const createBrandDto: CreateBrandDto = BrandsMock.create();
      const updateBrandDto: UpdateBrandDto = BrandsMock.update();

      const brand = await repository.save(createBrandDto);

      return request(app.getHttpServer())
        .put(`/brands/${brand.id}`)
        .send(updateBrandDto)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'brand already exists with this name',
          error: 'Bad Request',
        });
    });
  });

  describe('/PATCH Brands', () => {
    it('deve atualizar o caminho do icone da marca com sucesso', async () => {
      const brand = <Brand>await repository.findOne({
        where: {
          name: 'Volkswagen',
        },
      });
      const iconPath = BrandsMock.setIconPath();

      return request(app.getHttpServer())
        .patch(`/brands/${brand.id}/icon`)
        .send(iconPath)
        .expect(200);
    });

    it('deve remover o caminho do icone da marca com sucesso', async () => {
      const brand = <Brand>await repository.findOne({
        where: {
          name: 'Volkswagen',
        },
      });
      const iconPath = BrandsMock.removeIconPath();

      return request(app.getHttpServer())
        .patch(`/brands/${brand.id}/icon`)
        .send(iconPath)
        .expect(200);
    });
  });

  describe('/GET Brands', () => {
    it('deve retornar uma lista de marcas', async () => {
      return request(app.getHttpServer())
        .get('/brands')
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('deve retornar uma marca pelo pelo id', async () => {
      const user = <Brand>await repository.findOne({
        where: {
          name: 'Fiat',
        },
      });

      return request(app.getHttpServer())
        .get(`/brands/${user.id}`)
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('/DELETE Brands', () => {
    it('deve remover uma marca', async () => {
      const brand = <Brand>await repository.findOne({
        where: {
          name: 'Fiat',
        },
      });

      return request(app.getHttpServer())
        .delete(`/brands/${brand.id}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await repository.query("DELETE FROM brands WHERE name = 'Volkswagen'");
    await app.close();
  });
});
