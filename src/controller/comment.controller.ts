import { Controller, Inject, Body, Param, Post, Get, Put } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CommentService } from '../service/comment.service';
import { CommentDTO, ReplyDTO } from '../dto/comment.dto'
import { Validate } from '@midwayjs/validate'

@Controller('/comment')
export class CommentController {
  @Inject()
  ctx: Context;

  @Inject()
  commentService: CommentService;

  @Post('/')
  @Validate()
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
  @Validate()
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

  @Get('/likes/:userId/:commentId')
  async isLiked(@Param('userId') userId: number, @Param('commentId') commentId: number){
    const likes = await this.commentService.findLikes(userId, commentId);
    if(likes){
      return {
        code: 200,
        message: '用户点赞',
        liked: true,
      }
    }
    return {
      code: 200,
      message: '用户未点赞',
      liked: false,
    }
  }

  @Get('/likeCount/:id')
  async likeCount(@Param('id') id: number){
    const count = await this.commentService.likeCount(id);
    return {
      code: 200,
      message: '已获取点赞数',
      count: count,
    }
  }

  @Put('/likes/:userId/:commentId')
  async likes(@Param('userId') userId: number, @Param('commentId') commentId: number){
    const likes = await this.commentService.findLikes(userId, commentId)
    if(likes){
      await this.commentService.deleteLikes(likes.id);
      return {
        code: 200,
        message: '取消点赞',
      }
    }
    else {
      const likesData = {
        commentId: commentId,
        userId: userId,
      }
      await this.commentService.createLikes(likesData);
      return {
        code: 200,
        message: '成功点赞',
      }
    }
  }

  @Get('/:id')
  async allComment(@Param('id') id: number){
    const comment = await this.commentService.findAllComment(id);
    return {
      code: 200,
      message: '获取评论成功',
      comment: comment,
    }
  }
}