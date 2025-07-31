import { Controller, Inject, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ActivityService } from '../service/activity.service';
import { Validate } from '@midwayjs/validate';
import { registerDTO } from '../dto/activity.dto'

@Controller('/activity')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  activityService: ActivityService;

  @Post('/register')
  @Validate()
  async register(@Body() registerDTO: registerDTO){
    await this.activityService.createActivity(registerDTO);
    return {
      code: 200,
      message: '创建活动成功',
    }
  }
}