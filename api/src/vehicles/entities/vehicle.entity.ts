import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Model } from '../../models/entities/model.entity';
import { IModel } from '../../models/entities/model.interface';
import { IVehicle } from './vehicle.interface';

@Entity('vehicles')
export class Vehicle extends BaseEntity implements IVehicle {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: true })
  photoPath: string;

  @ManyToOne(() => Model, (model) => model.vehicles)
  model: IModel;
}
