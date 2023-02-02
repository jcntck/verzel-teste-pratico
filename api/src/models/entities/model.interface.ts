import { IBrand } from 'src/brands/entities/brand.interface';

export interface IModel {
  id: number;
  name: string;
  brand: IBrand;
}
