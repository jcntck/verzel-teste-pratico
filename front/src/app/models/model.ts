import { Brand } from './brand';
import { Vehicle } from './vehicle';

export interface Model {
  id: number;
  name: string;
  brand: Brand;
  vehicles?: Vehicle[];
}
