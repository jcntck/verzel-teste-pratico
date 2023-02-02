import { IModel } from 'src/models/entities/model.interface';

export interface IBrand {
  id: number;
  name: string;
  iconPath: string | null;
  models: IModel[];
}
