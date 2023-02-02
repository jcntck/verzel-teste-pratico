import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';

export class UsersMock {
  static CREATE_EMAIL: string = 'john@email.com';
  static UPDATE_EMAIL: string = 'john_updated@email.com';

  static create(): CreateUserDto {
    return {
      name: 'John Foe',
      email: UsersMock.CREATE_EMAIL,
      password: 'hash_password',
    };
  }

  static update(): UpdateUserDto {
    return {
      name: 'John Foe I',
      email: UsersMock.UPDATE_EMAIL,
    };
  }
}
