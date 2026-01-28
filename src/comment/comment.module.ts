import { ArticleEntity } from '@/article/article.entity';
import { CommentController } from '@/comment/comment.controller';
import { CommentEntity } from '@/comment/comment.entity';
import { CommentService } from '@/comment/comment.service';
import { ProfileModule } from '@/profile/profile.module';
import { UserEntity } from '@/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, UserEntity, ArticleEntity]), ProfileModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
