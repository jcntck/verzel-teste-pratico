import { IBrand } from 'src/brands/entities/brand.interface';
import { IVehicle } from 'src/vehicles/entities/vehicle.interface';

export interface IModel {
  id: number;
  name: string;
  brand: IBrand;
  vehicles: IVehicle;
}
