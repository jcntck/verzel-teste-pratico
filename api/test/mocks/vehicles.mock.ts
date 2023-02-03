import { CreateVehicleDto } from 'src/vehicles/dto/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/vehicles/dto/update-vehicle.dto';

export class VehiclesMock {
  static CREATE_NAME: string = 'INTENSE';
  static UPDATE_NAME: string = 'ZEN';
  static CREATE_MODELID: number;
  static UPDATE_MODELID: number;

  static create(): CreateVehicleDto {
    return {
      name: VehiclesMock.CREATE_NAME,
      photoPath: 'test/image/vehicle.png',
      modelId: VehiclesMock.CREATE_MODELID,
    };
  }

  static update(): UpdateVehicleDto {
    return {
      name: VehiclesMock.UPDATE_NAME,
      photoPath: 'test/image/vehicle.png',
      modelId: VehiclesMock.UPDATE_MODELID,
    };
  }
}
