import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Brand } from './../../brands/entities/brand.entity';
import { IBrand } from './../../brands/entities/brand.interface';
import { Vehicle } from './../../vehicles/entities/vehicle.entity';
import { IVehicle } from './../../vehicles/entities/vehicle.interface';
import { IModel } from './model.interface';

@Entity('models')
export class Model extends BaseEntity implements IModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @ManyToOne(() => Brand, (brand) => brand.models)
  brand: IBrand;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.model)
  vehicles: IVehicle;
}
