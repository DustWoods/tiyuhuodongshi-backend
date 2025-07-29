import { Provide, Inject } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { hashSync, genSaltSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Context } from '@midwayjs/koa';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userRepository: Repository<User>;

  @Inject()
  ctx: Context;

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async createUser(userData: { username: string; password: string; avatar: string }): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  hashPassword(password: string): string {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  generateToken(user: User): string {
    // 实际项目中建议使用JWT
    // 这里仅作示例，实际项目中需要：
    // 1. 引入jsonwebtoken包
    // 2. 配置secretKey
    // 3. 设置合理的过期时间
    return sign(
      { id: user.id, username: user.username },
      this.ctx.app.getConfig('jwt.secret'),
      { expiresIn: '24h' }
    );
  }
}
