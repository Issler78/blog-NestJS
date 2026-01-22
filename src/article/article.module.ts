import { ArticleController } from '@/article/article.controller';
import { ArticleEntity } from '@/article/article.entity';
import { ArticleService } from '@/article/article.service';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), UserModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
