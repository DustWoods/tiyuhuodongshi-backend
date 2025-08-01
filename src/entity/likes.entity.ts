import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
    comment: '评论ID',
  })
  commentId: number;

  @Column({
    type: 'bigint',
    comment: '点赞用户ID',
  })
  userId: number;
}
