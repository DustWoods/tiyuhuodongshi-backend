import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  activityId: number;
}
