import { IModel } from '../../models/entities/model.interface';

export interface IVehicle {
  id: number;
  name: string;
  photoPath: string | null;
  model: IModel;
}
