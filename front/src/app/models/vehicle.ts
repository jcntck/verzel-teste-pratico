import { Model } from './model';

export interface Vehicle {
  id: number;
  name: string;
  price: number;
  photoPath: string;
  model: Model;
}
