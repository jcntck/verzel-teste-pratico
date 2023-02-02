import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateModelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  brandId: number;
}
