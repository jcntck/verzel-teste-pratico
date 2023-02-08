import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
  HttpCode,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';
import { QueryOptions } from 'src/interface/query-options.interface';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindAndCountResponse, UsersService } from './users.service';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAndCount(
    @Query() queryOptions: QueryOptions,
  ): Promise<FindAndCountResponse> {
    return this.usersService.findAndCount(queryOptions);
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<User | null> {
    return this.usersService.findById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() user: CreateUserDto): Promise<User | undefined> {
    return this.usersService.create(user);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: number, @Body() user: UpdateUserDto): Promise<void> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.usersService.delete(id);
  }

  @Post(':id/check-password')
  @HttpCode(200)
  checkPassword(
    @Param('id') id: number,
    @Body('password') password: string,
  ): Promise<boolean> {
    return this.usersService.checkPassword(id, password);
  }

  @Patch(':id/change-password')
  @UsePipes(ValidationPipe)
  changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { newPassword } = changePasswordDto;
    return this.usersService.updatePassword(id, newPassword);
  }
}
