import { Controller, Inject, Body, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CommentService } from '../service/comment.service';
import { CommentDTO, ReplyDTO } from '../dto/comment.dto'

@Controller('/comment')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  commentService: CommentService;

  @Post('/')
  async addComment(@Body() commentDTO: CommentDTO){
    const comment = await this.commentService.createComment(commentDTO);
    return {
      code: 200,
      message: '创建评论成功',
      data: {
        id: comment.id,
      }
    }
  }

  @Post('/reply')
  async addReply(@Body() replyDTO: ReplyDTO){
    const reply = await this.commentService.createReply(replyDTO);
    return {
      code: 200,
      message: '创建回复成功',
      data: {
        id: reply.id,
      }
    }
  }
}