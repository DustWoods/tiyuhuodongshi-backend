import { Rule, RuleType } from '@midwayjs/validate';

export class RegisterDTO {
  @Rule(RuleType.string().required().min(1).error(new Error('用户名不能为空')))
  username: string;

  @Rule(RuleType.string().required().min(8).error(new Error('密码长度不能少于8位')))
  password: string;

  @Rule(RuleType.string().required().min(8).error(new Error('确认密码长度不能少于8位')))
  confirmPassword: string;
}

export class LoginDTO {
  @Rule(RuleType.string().required().min(1).error(new Error('用户名不能为空')))
  username: string;

  @Rule(RuleType.string().required().min(8).error(new Error('密码长度不能少于8位')))
  password: string;
}