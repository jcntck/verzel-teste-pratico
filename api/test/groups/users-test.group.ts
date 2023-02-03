import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../src/auth/auth.module';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { PostgresTypeOrmConfigFactory } from '../../src/config/postgres-typeorm.config';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../../src/users/dto/update-user.dto';
import { User } from '../../src/users/entities/user.entity';
import { UsersModule } from '../../src/users/users.module';
import { UsersMock } from '../mocks/users.mock';
import { AuthService } from '../../src/auth/auth.service';

export default () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let authService: AuthService;
  let access_token: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
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

  describe('/POST Users', () => {
    it('deve criar um usuário com sucesso', () => {
      const createUserDto: CreateUserDto = UsersMock.create();

      return request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${access_token}`)
        .send(createUserDto)
        .expect(201);
    });

    it('deve retornar um erro de email já utilizado', () => {
      const createUserDto: CreateUserDto = UsersMock.create();

      return request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${access_token}`)
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
        .put(`/api/v1/users/1256`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(updateUserDto)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'user not found',
          error: 'Not Found',
        });
    });

    it('deve atualizar as informações do usuário', async () => {
      const user = <User>await userRepository.findOne({
        where: {
          email: UsersMock.CREATE_EMAIL,
        },
      });

      const updateUserDto: UpdateUserDto = UsersMock.update();

      return request(app.getHttpServer())
        .put(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(updateUserDto)
        .expect(200);
    });

    it('deve retornar um erro de email já utilizado', async () => {
      const createUserDto: CreateUserDto = UsersMock.create();
      const updateUserDto: UpdateUserDto = UsersMock.update();

      const user = await userRepository.save(createUserDto);

      return request(app.getHttpServer())
        .put(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${access_token}`)
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
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('deve retornar um usuário pelo id', async () => {
      const user = <User>await userRepository.findOne({
        where: {
          email: UsersMock.CREATE_EMAIL,
        },
      });

      return request(app.getHttpServer())
        .get(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('/DELETE Users', () => {
    it('deve remover um usuário', async () => {
      const user = <User>await userRepository.findOne({
        where: {
          email: UsersMock.UPDATE_EMAIL,
        },
      });

      return request(app.getHttpServer())
        .delete(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await userRepository.query(
      `DELETE FROM users WHERE email in ('${UsersMock.CREATE_EMAIL}', 'admin_test@e2e.com')`,
    );
    await app.close();
  });
};
