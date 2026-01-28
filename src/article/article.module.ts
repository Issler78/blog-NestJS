import { ArticleController } from '@/article/article.controller';
import { ArticleEntity } from '@/article/article.entity';
import { ArticleService } from '@/article/article.service';
import { FollowEntity } from '@/profile/follow.entity';
import { UserEntity } from '@/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, FollowEntity, UserEntity])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
