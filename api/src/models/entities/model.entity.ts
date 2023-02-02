import { Brand } from './../../brands/entities/brand.entity';
import { IBrand } from './../../brands/entities/brand.interface';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IModel } from './model.interface';

@Entity('models')
@Unique(['name'])
export class Model extends BaseEntity implements IModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @ManyToOne(() => Brand, (brand) => brand.models)
  brand: IBrand;
}
