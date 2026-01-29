import { ArticleEntity } from '@/article/article.entity';
import { CommentEntity } from '@/comment/comment.entity';
import { createCommentDto } from '@/comment/dto/createComment.dto';
import { CommentType } from '@/comment/types/comment.type';
import { ICommentResponse } from '@/comment/types/commentResponse.interface';
import { ICommentsResponse } from '@/comment/types/commentsResponse.interface';
import { ProfileService } from '@/profile/profile.service';
import { ProfileType } from '@/profile/types/profile.type';
import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,

    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,

    private readonly profileService: ProfileService
  ) {}

  async createComment(currentArticleSlug: string, currentUser: UserEntity, createCommentDto: createCommentDto): Promise<CommentType> {
    const currentArticle = await this.articleRepository.findOne({
      where: {
        slug: currentArticleSlug
      }
    });

    if(!currentArticle) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }


    const newComment = new CommentEntity();
    Object.assign(newComment, createCommentDto);
    newComment.author = currentUser;
    newComment.article = currentArticle;

    await this.commentRepository.save(newComment);



    const profile = await this.profileService.getProfile(currentUser.id, currentUser.username);

    return { ...newComment, author: profile };
  }

  async getCommentsFromArticle(currentArticleSlug: string, currentUserId: number): Promise<ICommentsResponse> {
    const article = await this.articleRepository.findOne({
      where: {
        slug: currentArticleSlug
      },
      relations: ['comments']
    });

    if(!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    if(article.comments.length === 0) {
      return { comments: [] };
    }


    const usernames = [ ...new Set(article.comments.map(comment => comment.author.username)) ];
    const profiles = await this.profileService.getProfilesByUsernames(currentUserId, usernames);

    const comments: CommentType[] = article.comments.map(comment => ({
        id: comment.id,
        body: comment.body,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        author: profiles.get(comment.author.username)!
      })
    );

    return { comments: comments };
  }

  async deleteComment(currentUserId: number, commentId: number): Promise<DeleteResult> {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId
      }
    });

    if(!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    if(comment.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    return this.commentRepository.delete({ id: comment.id });
  }

  async generateCommentResponse(comment: CommentType, currentUserId: number): Promise<ICommentResponse> {
    const profile = await this.profileService.getProfile(currentUserId, comment.author.username);

    return { 
      comment: {
        ...comment,
        author: profile
      }
    };
  }
}
