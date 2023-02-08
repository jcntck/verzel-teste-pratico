import { Model } from './model';

export interface Brand {
  id: number;
  name: string;
  iconPath: string;
  models?: Model[];
}
