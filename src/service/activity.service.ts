import { Provide, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Activity } from '../entity/activity.entity';
import { Registration } from '../entity/registration.entity';
import { CommentService } from '../service/comment.service';
import { Repository } from 'typeorm';

@Provide()
export class ActivityService {
  @InjectEntityModel(Activity)
  activityRepository: Repository<Activity>;

  @InjectEntityModel(Registration)
  registrationRepository: Repository<Registration>;

  @Inject()
  ctx: Context;

  @Inject()
  commentService: CommentService;

  async createActivity(activityData: { hostId: number; project: string; type: string; date: string; location: string; description: string }): Promise<Activity> {
    const user = this.activityRepository.create(activityData);
    return this.activityRepository.save(user);
  }

  async deleteExpiredActivities(date: string): Promise<number> {
    // 1. 先查询所有过期的活动
    const expiredActivities = await this.activityRepository
      .createQueryBuilder('activity')
      .select('id')
      .where('date < :date', { date })
      .getMany();

    if (expiredActivities.length === 0) {
      return 0;
    }

    // 2. 提取过期活动的id列表
    const expiredActivityIds = expiredActivities.map(activity => activity.id);

    // 3. 删除这些活动对应的报名记录
    await this.registrationRepository
      .createQueryBuilder()
      .delete()
      .from(Registration)
      .where('activityId IN (:...ids)', { ids: expiredActivityIds })
      .execute();

    // 4. 删除过期的活动本身
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

  async deleteRegistrationById(id: number){
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

  async findAllRegisterActivities(id: number): Promise<Activity[]>{
    return await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.hostId = :id', { id })
      .orderBy('activity.date', 'ASC')
      .getMany();
  }

  async findAllParticipateActivities(id: number): Promise<Activity[]>{
    // 1. 根据userId查询所有相关的报名记录，获取对应的activityId
    const registrations = await this.registrationRepository
      .createQueryBuilder('registration')
      .select('registration.activityId')
      .where('registration.userId = :id', { id })
      .getMany();

    if (registrations.length === 0) {
      return [];
    }

    // 2. 提取所有活动ID
    const activityIds = registrations.map(reg => reg.activityId);

    // 3. 根据活动ID查询对应的活动，并按时间升序排序
    return this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.id IN (:...activityIds)', { activityIds })
      .orderBy('activity.date', 'ASC')
      .getMany();
  }
  
  async findActivityById(id: number): Promise<Activity>{
    return this.activityRepository.findOne({where: { id }});
  }

  async deleteActivityById(id: number) {
    await this.registrationRepository.delete({activityId: id});
    await this.commentService.deleteAllCommentsByActivityId(id);
    return await this.activityRepository.delete(id);
  }
}