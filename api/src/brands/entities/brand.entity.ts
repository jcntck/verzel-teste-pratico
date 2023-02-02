import { Model } from './../../models/entities/model.entity';
import { IModel } from './../../models/entities/model.interface';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IBrand } from './brand.interface';

@Entity('brands')
@Unique(['name'])
export class Brand extends BaseEntity implements IBrand {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  iconPath: string | null;

  @OneToMany(() => Model, (model) => model.brand)
  models: IModel[];
}
