import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';

export class UsersMock {
  static create(): CreateUserDto {
    return {
      name: 'John Foe',
      email: 'john@email.com',
      password: 'hash_password',
    };
  }

  static update(): UpdateUserDto {
    return {
      name: 'John Foe I',
      email: 'john_updated@email.com',
    };
  }
}
