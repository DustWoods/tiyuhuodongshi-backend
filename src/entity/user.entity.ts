import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
    comment: '用户名',
 })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '密码',
  })
  password: string;

  @Column({ nullable: true })
  avatar: string; // 头像字段
}    