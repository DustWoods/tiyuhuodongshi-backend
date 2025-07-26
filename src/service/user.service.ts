import { Provide } from '@midwayjs/core';
import { Repository } from 'typeorm'
import { User } from '../entity/user.entity'
import { InjectEntityModel } from '@midwayjs/typeorm'

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  async findUser(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ where: { username } });
  }
}
