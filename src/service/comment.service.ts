import { Provide, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Comment } from '../entity/comment.entity';
import { Reply } from '../entity/reply.entity';
import { Likes } from '../entity/likes.entity';
import { Repository, DeleteResult, In } from 'typeorm';

@Provide()
export class CommentService {
  @InjectEntityModel(Comment)
  commentRepository: Repository<Comment>;

  @InjectEntityModel(Reply)
  replyRepository: Repository<Reply>;

  @InjectEntityModel(Likes)
  likesRepository: Repository<Likes>;

  @Inject()
  ctx: Context;

  async createComment(commentData: {
    activityId: number;
    userId: number;
    username: string;
    time: string;
    content: string;
  }): Promise<Comment> {
    const comment = this.commentRepository.create(commentData);
    return this.commentRepository.save(comment);
  }

  async createReply(replyData: {
    commentId: number;
    username: string;
    time: string;
    content: string;
  }): Promise<Reply> {
    const reply = this.replyRepository.create(replyData);
    return this.replyRepository.save(reply);
  }

  async findLikes(userId: number, commentId: number): Promise<Likes> {
    return this.likesRepository.findOne({
      where: { userId: userId, commentId: commentId },
    });
  }

  async likeCount(commentId: number): Promise<number> {
    return this.likesRepository
      .createQueryBuilder('Likes')
      .where('likes.commentId = :commentId', { commentId: commentId })
      .getCount();
  }

  async createLikes(likesData: {
    commentId: number;
    userId: number;
  }): Promise<Likes> {
    const likes = this.likesRepository.create(likesData);
    return this.likesRepository.save(likes);
  }

  async deleteLikes(id: number): Promise<DeleteResult> {
    return this.likesRepository.delete(id);
  }

  async findAllComment(
    activityId: number
  ): Promise<(Comment & { replies: Reply[] })[]> {
    try {
      // 1. 根据activityId查询所有评论
      const comments = await this.commentRepository.find({
        where: { activityId },
        order: { time: 'DESC' }, // 按时间倒序，最新的评论在前
      });

      // 2. 为每条评论查询对应的回复
      const commentsWithReplies = await Promise.all(
        comments.map(async comment => {
          // 查询当前评论的所有回复
          const replies = await this.replyRepository.find({
            where: { commentId: comment.id },
            order: { time: 'ASC' }, // 按时间正序，最早的回复在前
          });

          // 将回复添加到评论对象中
          return {
            ...comment,
            replies,
          };
        })
      );

      return commentsWithReplies;
    } catch (error) {
      // 错误处理
      console.error('获取评论及回复失败:', error);
      throw new Error(`获取评论及回复失败: ${error.message}`);
    }
  }

  async deleteAllCommentsByActivityId(activityId: number): Promise<{
    commentsDeleted: number;
    repliesDeleted: number;
    likesDeleted: number;
  }> {
    try {
      // 1. 查询该活动下的所有评论
      const comments = await this.commentRepository.find({
        where: { activityId: activityId },
      });

      if (comments.length === 0) {
        return {
          commentsDeleted: 0,
          repliesDeleted: 0,
          likesDeleted: 0,
        };
      }

      // 提取所有评论ID
      const commentIds = comments.map(comment => comment.id);

      // 2. 删除这些评论的所有点赞
      const { affected: likesDeleted } = await this.likesRepository.delete({
        commentId: In(commentIds),
      });

      // 3. 删除这些评论的所有回复
      const { affected: repliesDeleted } = await this.replyRepository.delete({
        commentId: In(commentIds),
      });

      // 4. 最后删除所有评论
      const { affected: commentsDeleted } = await this.commentRepository.delete(
        {
          activityId,
        }
      );

      return {
        commentsDeleted: commentsDeleted || 0,
        repliesDeleted: repliesDeleted || 0,
        likesDeleted: likesDeleted || 0,
      };
    } catch (error) {
      console.error('删除评论及关联数据失败:', error);
      throw new Error(`删除评论及关联数据失败: ${error.message}`);
    }
  }

  async deleteCommentById(id: number): Promise<DeleteResult> {
    await this.replyRepository.delete({ commentId: id });
    await this.likesRepository.delete({ commentId: id });
    return this.commentRepository.delete(id);
  }
}
