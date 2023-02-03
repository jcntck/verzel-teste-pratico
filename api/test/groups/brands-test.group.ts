import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateBrandDto } from 'src/brands/dto/update-brand.dto';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import { BrandsModule } from '../../src/brands/brands.module';
import { CreateBrandDto } from '../../src/brands/dto/create-brand.dto';
import { Brand } from '../../src/brands/entities/brand.entity';
import { PostgresTypeOrmConfigFactory } from '../../src/config/postgres-typeorm.config';
import { User } from '../../src/users/entities/user.entity';
import { BrandsMock } from '../mocks/brands.mock';

export default () => {
  let app: INestApplication;
  let brandRepository: Repository<Brand>;
  let userRepository: Repository<User>;
  let authService: AuthService;
  let access_token: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
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

    brandRepository = module.get('BrandRepository');

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

  describe('/POST Brands', () => {
    it('deve criar uma marca com sucesso', () => {
      const createBrandDto: CreateBrandDto = BrandsMock.create();

      return request(app.getHttpServer())
        .post('/api/v1/brands')
        .set('Authorization', `Bearer ${access_token}`)
        .send(createBrandDto)
        .expect(201);
    });

    it('deve retornar erro de marca já existe', () => {
      const createBrandDto: CreateBrandDto = BrandsMock.create();

      return request(app.getHttpServer())
        .post('/api/v1/brands')
        .set('Authorization', `Bearer ${access_token}`)
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
        .put(`/api/v1/brands/1256`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(updateBrandDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'brand not found',
          error: 'Not Found',
        });
    });

    it('deve atualizar as informações da marca', async () => {
      const brand = <Brand>await brandRepository.findOne({
        where: {
          name: BrandsMock.CREATE_NAME,
        },
      });

      const updateBrandDto: UpdateBrandDto = BrandsMock.update();

      return request(app.getHttpServer())
        .put(`/api/v1/brands/${brand.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(updateBrandDto)
        .expect(200);
    });

    it('deve retornar um erro de nome já utilizado', async () => {
      const createBrandDto: CreateBrandDto = BrandsMock.create();
      const updateBrandDto: UpdateBrandDto = BrandsMock.update();

      const brand = await brandRepository.save(createBrandDto);

      return request(app.getHttpServer())
        .put(`/api/v1/brands/${brand.id}`)
        .set('Authorization', `Bearer ${access_token}`)
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
      const brand = <Brand>await brandRepository.findOne({
        where: {
          name: BrandsMock.CREATE_NAME,
        },
      });
      const iconPath = BrandsMock.setIconPath();

      return request(app.getHttpServer())
        .patch(`/api/v1/brands/${brand.id}/icon`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(iconPath)
        .expect(200);
    });

    it('deve remover o caminho do icone da marca com sucesso', async () => {
      const brand = <Brand>await brandRepository.findOne({
        where: {
          name: BrandsMock.CREATE_NAME,
        },
      });
      const iconPath = BrandsMock.removeIconPath();

      return request(app.getHttpServer())
        .patch(`/api/v1/brands/${brand.id}/icon`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(iconPath)
        .expect(200);
    });
  });

  describe('/GET Brands', () => {
    it('deve retornar uma lista de marcas', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/brands')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('deve retornar uma marca pelo pelo id', async () => {
      const user = <Brand>await brandRepository.findOne({
        where: {
          name: BrandsMock.UPDATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .get(`/api/v1/brands/${user.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('/DELETE Brands', () => {
    it('deve remover uma marca', async () => {
      const brand = <Brand>await brandRepository.findOne({
        where: {
          name: BrandsMock.UPDATE_NAME,
        },
      });

      return request(app.getHttpServer())
        .delete(`/api/v1/brands/${brand.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await brandRepository.query(
      `DELETE FROM brands WHERE name = '${BrandsMock.CREATE_NAME}'`,
    );
    await userRepository.query(
      `DELETE FROM users WHERE email = 'admin_test@e2e.com'`,
    );
    await app.close();
  });
};
