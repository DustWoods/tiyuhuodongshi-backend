import { Rule, RuleType } from '@midwayjs/validate';

export class RegisterDTO {
  @Rule(RuleType.string().required().min(1).error(new Error('用户名不能为空')))
  username: string;

  @Rule(RuleType.string().required().min(8).error(new Error('密码长度不能少于8位')))
  password: string;

  @Rule(RuleType.string().required())
  confirmPassword: string;
}

export class LoginDTO {
  @Rule(RuleType.string().required().min(1).error(new Error('用户名不能为空')))
  username: string;

  @Rule(RuleType.string().required().min(8).error(new Error('密码长度不能少于8位')))
  password: string;
}

export class UpdateUserDTO {
  
  @Rule(RuleType.string().min(1).optional())
  username?: string;

  @Rule(RuleType.string().min(8).max(20).optional())
  password?: string;

  @Rule(RuleType.string().optional())
  avatarUrl?: string;
  // 不需要验证avatarUrl，因为它是文件上传
}