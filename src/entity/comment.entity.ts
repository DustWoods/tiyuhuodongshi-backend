import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
    comment: '活动ID',
  })
  activityId: number;
  
  @Column({
    type: 'bigint',
    comment: '评论人ID'
  })
  userId: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '用户名'
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '消息时间'
  })
  time: string;

  @Column({
    type: 'text',
    comment: '消息内容'
  })
  content: string;
}