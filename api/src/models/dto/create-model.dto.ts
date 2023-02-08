import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateModelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  brandId: number;
}
