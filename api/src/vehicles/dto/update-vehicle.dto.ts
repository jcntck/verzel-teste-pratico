import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateVehicleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  photoPath: string;

  @IsNumber()
  @IsNotEmpty()
  modelId: number;
}
