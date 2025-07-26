import { Controller, Post, Body, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/login')
  async login(@Body() body: any) {
    // 手动验证参数
    if (typeof body !== 'object' || body === null) {
      this.ctx.status = 400;
      return { message: '请求体必须是对象' };
    }

    const { username, password } = body;

    if (typeof username !== 'string' || !username) {
      this.ctx.status = 400;
      return { message: '用户名不能为空' };
    }

    if (typeof password !== 'string' || !password) {
      this.ctx.status = 400;
      return { message: '密码不能为空' };
    }

    const user = await this.userService.findUser(username);

    if (!user || user.password !== password) {
      this.ctx.status = 401;
      return { message: '用户名或密码错误' };
    }

    return {
      data: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      },
    };
  }
}  