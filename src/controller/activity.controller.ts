import { Controller, Inject, Post, Get, Body, Param } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ActivityService } from '../service/activity.service';
import { Validate } from '@midwayjs/validate';
import { participationDTO, registerDTO, relationshipDTO } from '../dto/activity.dto'

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

  @Get('/all/:hostId')
  async getValidActivities(@Param('hostId') hostId: number) {
    try {
      // 获取当前时间，格式化为与数据库相同的格式 (YYYY-MM-DDTHH:mm)
      const now = new Date();
      const currentTime = now.toISOString().slice(0, 16); // 截取到分钟

      // 1. 删除所有早于当前时间的活动
      const deletedCount = await this.activityService.deleteExpiredActivities(currentTime);

      // 2. 查询所有活动并按时间排序（最近的在前）
      const activities = await this.activityService.findAllActivitiesSorted(hostId);

      return {
        success: true,
        message: '活动清理完成并返回有效活动',
        data: {
          deletedCount,
          activities,
        }
      };
    } catch (error) {
      this.ctx.logger.error('处理活动时发生错误:', error);
      return {
        success: false,
        message: '处理活动失败',
        error: error.message
      };
    }
  }

  @Post('/relationship')
  @Validate()
  async relationship(@Body() relationshipDTO: relationshipDTO){
    const relationship = await this.activityService.findRelationship(relationshipDTO.userId, relationshipDTO.activityId);
    if(relationship){
      return {
        code: 200,
          state: '取消报名',
      }
    }
    else{
      const activity = await this.activityService.findActivityById(relationshipDTO.activityId);
      if(relationshipDTO.userId === activity.hostId){
        return {
          code: 200,
          state: '取消活动',
        }
      }
      else{
        return {
          code: 200,
          state: '立即报名',
        }
      }
    }
  }

  @Get('/participant/:id')
  async participant(@Param('id') id: number){
    const count = await this.activityService.registrationCount(id);
    return {
        code: 200,
        data:{
            count: count,
        }
    }
  }

  @Post('/participation')
  @Validate()
  async participation(@Body() participationDTO: participationDTO){
    const registration = await this.activityService.findRelationship(participationDTO.userId, participationDTO.activityId);
    if(registration){
        await this.activityService.deleteRegistrationById(registration.id);
        return {
            code: 200,
            message: '成功取消报名',
        }
    }
    else{
        await this.activityService.createRegistration(participationDTO.userId, participationDTO.activityId);
        return {
            code: 200,
            message: '成功报名',
        }
    }
  }

  @Get('/register/:id')
  async myRegisterActivities(@Param('id') id: number){
    try {
      // 获取当前时间，格式化为与数据库相同的格式 (YYYY-MM-DDTHH:mm)
      const now = new Date();
      const currentTime = now.toISOString().slice(0, 16); // 截取到分钟

      // 1. 删除所有早于当前时间的活动
      const deletedCount = await this.activityService.deleteExpiredActivities(currentTime);

      const activities = await this.activityService.findAllRegisterActivities(id);

      return {
        success: true,
        message: '活动清理完成并返回有效活动',
        data: {
          deletedCount,
          activities,
        }
      };
    } catch (error) {
      this.ctx.logger.error('处理活动时发生错误:', error);
      return {
        success: false,
        message: '处理活动失败',
        error: error.message
      };
    }
  }

  @Get('/participate/:id')
  async myParticipateActivities(@Param('id') id: number){
    try {
      // 获取当前时间，格式化为与数据库相同的格式 (YYYY-MM-DDTHH:mm)
      const now = new Date();
      const currentTime = now.toISOString().slice(0, 16); // 截取到分钟

      // 1. 删除所有早于当前时间的活动
      const deletedCount = await this.activityService.deleteExpiredActivities(currentTime);

      const activities = await this.activityService.findAllParticipateActivities(id);

      return {
        success: true,
        message: '活动清理完成并返回有效活动',
        data: {
          deletedCount,
          activities,
        }
      };
    } catch (error) {
      this.ctx.logger.error('处理活动时发生错误:', error);
      return {
        success: false,
        message: '处理活动失败',
        error: error.message
      };
    }
  }

  @Get('/:id')
  async activity(@Param('id') id: number){
    const result = await this.activityService.deleteActivityById(id);

      if (result.affected === 0) {
        this.ctx.status = 404;
        return {
          success: false,
          message: '活动不存在或已被删除'
        }
      }

      this.ctx.status = 200;
      return {
        success: true,
        message: '活动删除成功',
        data: {
          id
        }
      }
  }
}