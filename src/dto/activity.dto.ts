import { Rule, RuleType } from '@midwayjs/validate';

export class registerDTO{
  @Rule(RuleType.number().required().min(1).error(new Error('非法用户')))
  hostId: number

  @Rule(RuleType.string().required().max(100).error(new Error('项目名称过长')))
  project: string

  @Rule(RuleType.string().required().max(50).error(new Error('项目类型名称过长')))
  type: string

  @Rule(RuleType.string().required().max(50).error(new Error('非法时间格式')))
  date: string

  @Rule(RuleType.string().required().max(255).error(new Error('地点名称过长')))
  location: string

  @Rule(RuleType.string().required())
  description: string
}

export class relationshipDTO{
  @Rule(RuleType.number().required())
  userId: number

  @Rule(RuleType.number().required())
  activityId: number
}

export class participationDTO{
  @Rule(RuleType.number().required())
  userId: number

  @Rule(RuleType.number().required())
  activityId: number
}