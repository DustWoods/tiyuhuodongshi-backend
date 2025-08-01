import { Controller, Inject, Body, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CommentService } from '../service/comment.service';
import { CommentDTO } from '../dto/comment.dto'

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
}