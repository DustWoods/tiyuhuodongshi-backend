import { Provide, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Comment } from '../entity/comment.entity';
import { Reply } from '../entity/reply.entity'
import { Likes } from '../entity/likes.entity'
import { Repository } from 'typeorm'

@Provide()
export class CommentService {
  @InjectEntityModel(Comment)
  commentRepository: Repository<Comment>

  @InjectEntityModel(Reply)
  replyRepository: Repository<Reply>

  @InjectEntityModel(Likes)
  likesRepository: Repository<Likes>

  @Inject()
  ctx: Context;

  async createComment(commentData: {activityId: number, userId: number, username: string, time: string, content: string}): Promise<Comment>{
    const comment = this.commentRepository.create(commentData);
    return this.commentRepository.save(comment);
  }
}