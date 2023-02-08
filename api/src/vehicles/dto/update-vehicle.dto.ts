import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateVehicleDto {
  @ApiProperty({
    description: 'Nome do veículo',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Caminho da foto do veículo',
    type: String,
    required: false,
  })
  photoPath: string | undefined;

  @ApiProperty({
    description: 'Valor do veículo',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'ID do modelo do veículo',
  })
  @IsNumber()
  @IsNotEmpty()
  modelId: number;
}
