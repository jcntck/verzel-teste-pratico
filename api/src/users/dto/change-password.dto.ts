import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
