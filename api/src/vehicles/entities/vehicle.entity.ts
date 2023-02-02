import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vehicles')
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;
}
