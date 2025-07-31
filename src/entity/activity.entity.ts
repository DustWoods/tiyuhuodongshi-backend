import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
    comment: '活动发起人ID',
  })
  hostId: number;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '项目名称'
  })
  project: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '活动类型'
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '活动日期'
  })
  date: Date;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '活动举办地点'
  })
  location: string;

  @Column({
    type: 'text',
    comment: '活动详细描述'
  })
  description: string;
}    