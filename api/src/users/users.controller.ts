import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
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
}
