import { Provide, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Activity } from '../entity/activity.entity';
import { Repository } from 'typeorm';

@Provide()
export class ActivityService {
  @InjectEntityModel(Activity)
  activityRepository: Repository<Activity>;

  @Inject()
  ctx: Context;

  async createActivity(activityData: { hostId: number; project: string; type: string; date: string; location: string; description: string }): Promise<Activity> {
    const user = this.activityRepository.create(activityData);
    return this.activityRepository.save(user);
  }

}