import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateVehicleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  photoPath: string;

  @IsNumber()
  @IsNotEmpty()
  modelId: number;
}
