import { Controller, Post, Body, Inject } from '@midwayjs/core';
import { Validate } from '@midwayjs/validate';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { RegisterDTO, LoginDTO } from '../dto/user.dto';
import { compareSync } from 'bcryptjs';

@Controller('/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/register')
  @Validate()
  async register(@Body() registerDTO: RegisterDTO) {
    // 验证两次密码是否一致
    if (registerDTO.password !== registerDTO.confirmPassword) {
      this.ctx.throw(400, '两次输入的密码不一致');
    }

    // 检查用户名是否已存在
    const existingUser = await this.userService.getUserByUsername(registerDTO.username);
    if (existingUser) {
      this.ctx.throw(400, '用户名已存在');
    }

    // 加密密码
    const hashedPassword = await this.userService.hashPassword(registerDTO.password);

    // 创建新用户
    const user = await this.userService.createUser({
      username: registerDTO.username,
      password: hashedPassword,
      avatar: 'base.jpg',
    });

    return {
      code: 200,
      message: '注册成功',
      data: {
        id: user.id,
        username: user.username,
      }
    };
  }

  @Post('/login')
  @Validate()
  async login(@Body() loginDTO: LoginDTO) {
    // 获取用户信息
    const user = await this.userService.getUserByUsername(loginDTO.username);
    
    // 验证用户是否存在
    if (!user) {
      this.ctx.throw(401, '用户名或密码错误');
    }

    // 验证密码
    const isPasswordValid = compareSync(loginDTO.password, user.password);
    if (!isPasswordValid) {
      this.ctx.throw(401, '用户名或密码错误');
    }

    // 生成并返回token（示例中使用简单方式，实际项目建议使用JWT）
    const token = this.userService.generateToken(user);

    return {
      code: 200,
      message: '登录成功',
      data: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        token
      }
    };
  }
}