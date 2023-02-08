import { ApiProperty } from '@nestjs/swagger/dist';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
