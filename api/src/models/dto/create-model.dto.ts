import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateModelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  brandId: number;
}
