import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateModelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  brandId: number;
}
