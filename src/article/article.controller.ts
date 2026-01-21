import { ArticleEntity } from '@/article/article.entity';
import { ArticleService } from '@/article/article.service';
import { CreateArticleDto } from '@/article/dto/createArticle.dto';
import { User } from '@/user/decorators/user.decorator';
import { AuthGuard } from '@/user/guards/auth.guard';
import { UserEntity } from '@/user/user.entity';
import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createArticle(@User() user: UserEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    return await this.articleService.createArticle(user, createArticleDto);
  }
}
