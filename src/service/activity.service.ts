import { Provide, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Activity } from '../entity/activity.entity';
import { Registration } from '../entity/registration.entity';
import { Repository } from 'typeorm';

@Provide()
export class ActivityService {
  @InjectEntityModel(Activity)
  activityRepository: Repository<Activity>;

  @InjectEntityModel(Registration)
  registrationRepository: Repository<Registration>;

  @Inject()
  ctx: Context;

  async createActivity(activityData: { hostId: number; project: string; type: string; date: string; location: string; description: string }): Promise<Activity> {
    const user = this.activityRepository.create(activityData);
    return this.activityRepository.save(user);
  }

  async deleteExpiredActivities(date: string): Promise<number> {
    const result = await this.activityRepository
      .createQueryBuilder()
      .delete()
      .from(Activity)
      .where('date < :date', { date })
      .execute();
    
    return result.affected || 0;
  }

  async findAllActivitiesSorted(hostId: number): Promise<Activity[]> {
    return await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.hostId != :hostId', { hostId })
      .orderBy('activity.date', 'ASC')
      .getMany();
  }
  
  async registrationCount(id: number): Promise<number> {
    return await this.registrationRepository
          .createQueryBuilder('registration')
          .where('registration.activityId = :activityId', { activityId: id })
          .getCount();
  }

  async findRelationship(userId: number, activityId: number): Promise<Registration>{
    return this.registrationRepository.findOne({where: {userId: userId, activityId: activityId}})
  }

  async deleteRegistration(id: number){
    return this.registrationRepository.delete(id);
  }

  async createRegistration(userId: number, activityId: number){
    const newData = {
        userId: userId, 
        activityId: activityId,
    }
    const user = this.registrationRepository.create(newData);
    return this.registrationRepository.save(user);
  }
}