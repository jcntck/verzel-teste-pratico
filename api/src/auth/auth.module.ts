import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport/dist';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtOptionsFactory } from './config/jwt-options.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: JwtOptionsFactory,
      inject: [ConfigService],
    }),
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
