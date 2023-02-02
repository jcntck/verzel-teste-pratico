import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { PostgresTypeOrmConfigFactory } from '../src/config/postgres-typeorm.config';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../src/users/dto/update-user.dto';
import { User } from '../src/users/user.entity';
import { UsersModule } from '../src/users/users.module';
import { UsersMock } from './mocks/users.mock';

describe('Users', () => {
  let app: INestApplication;
  let repository: Repository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UsersModule,
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

    repository = module.get('UserRepository');
  });

  describe('/POST Users', () => {
    it('deve criar um usuário com sucesso', () => {
      const createUserDto: CreateUserDto = UsersMock.create();

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);
    });

    it('deve retornar um erro de email já utilizado', () => {
      const createUserDto: CreateUserDto = UsersMock.create();

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'user already exists with this email',
          error: 'Bad Request',
        });
    });
  });

  describe('/PUT Users', () => {
    it('deve retornar erro de usuário não encontrado', () => {
      const updateUserDto: UpdateUserDto = UsersMock.update();

      return request(app.getHttpServer())
        .put(`/users/1256`)
        .send(updateUserDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'user not found',
          error: 'Not Found',
        });
    });

    it('deve atualizar as informações do usuário', async () => {
      const user = <User>await repository.findOne({
        where: {
          email: 'john@email.com',
        },
      });

      const updateUserDto: UpdateUserDto = UsersMock.update();

      return request(app.getHttpServer())
        .put(`/users/${user.id}`)
        .send(updateUserDto)
        .expect(200);
    });

    it('deve retornar um erro de email já utilizado', async () => {
      const createUserDto: CreateUserDto = UsersMock.create();
      const updateUserDto: UpdateUserDto = UsersMock.update();

      const user = await repository.save(createUserDto);

      return request(app.getHttpServer())
        .put(`/users/${user.id}`)
        .send(updateUserDto)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'user already exists with this email',
          error: 'Bad Request',
        });
    });
  });

  describe('/GET Users', () => {
    it('deve retornar uma lista de usuários', async () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('deve retornar um usuário pelo id', async () => {
      const user = <User>await repository.findOne({
        where: {
          email: 'john@email.com',
        },
      });

      return request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('/DELETE Users', () => {
    it('deve remover um usuário', async () => {
      const user = <User>await repository.findOne({
        where: {
          email: 'john_updated@email.com',
        },
      });

      return request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await repository.query("DELETE FROM users WHERE email = 'john@email.com'");
    await app.close();
  });
});
