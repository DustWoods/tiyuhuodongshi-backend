import { Rule, RuleType} from '@midwayjs/validate';

export class CommentDTO{
    @Rule(RuleType.number().required())
    activityId: number;

    @Rule(RuleType.number().required())
    userId: number;

    @Rule(RuleType.string().required().max(50))
    username: string;

    @Rule(RuleType.string().required().max(50))
    time: string;

    @Rule(RuleType.string().required())
    content: string;
}

export class LikesDTO{
    @Rule(RuleType.number().required())
    commentId: number;

    @Rule(RuleType.number().required())
    userId: number;
}

export class ReplyDTO{
    @Rule(RuleType.number().required())
    commentId: number;

    @Rule(RuleType.string().required())
    username: string;

    @Rule(RuleType.string().required())
    time: string;

    @Rule(RuleType.string().required())
    content: string;
}