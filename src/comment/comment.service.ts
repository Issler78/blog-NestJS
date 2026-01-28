import { ArticleEntity } from '@/article/article.entity';
import { CommentEntity } from '@/comment/comment.entity';
import { createCommentDto } from '@/comment/dto/createComment.dto';
import { CommentType } from '@/comment/types/comment.type';
import { ICommentResponse } from '@/comment/types/commentResponse.interface';
import { ProfileService } from '@/profile/profile.service';
import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async generateCommentResponse(comment: CommentType, currentUserId: number): Promise<ICommentResponse> {
    delete comment?.article;

    const profile = await this.profileService.getProfile(currentUserId, comment.author.username);
    const profileRes = this.profileService.generateProfileResponse(profile);

    return { 
      comment: {
        ...comment,
        author: profileRes
      }
    };
  }
}
