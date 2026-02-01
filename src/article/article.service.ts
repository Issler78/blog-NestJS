import { ArticleEntity } from '@/article/article.entity';
import { CreateArticleDto } from '@/article/dto/createArticle.dto';
import { IArticleResponse } from '@/article/types/articleResponse.interface';
import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import slugify from 'slugify';
import { UpdateArticleDto } from '@/article/dto/updateArticle.dto';
import { IArticlesResponse } from '@/article/types/articlesResponse.interface';
import { FollowEntity } from '@/profile/follow.entity';
import { ProfileService } from '@/profile/profile.service';
import { ArticleType } from '@/article/types/article.type';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,

    private readonly profileService: ProfileService
  ) {}

  async createArticle(user: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = new ArticleEntity();

    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.generateSlug(article.title);
    article.author = user;

    return await this.articleRepository.save(article);
  }

  async getSingleArticle(slug: string): Promise<ArticleEntity>{
    const article = await this.findBySlug(slug);

    return article;
  }

  async updateArticle(slug: string, currentUserId: number, updateArticleDto: UpdateArticleDto): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if(article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    if(updateArticleDto.title){
      article.slug = this.generateSlug(updateArticleDto.title);
    }

    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if(article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({ slug });
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: {
        slug
      }
    });

    if(!article) {
      throw new HttpException('Article is not found', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async findAll(currentUserId: number, query: any): Promise<IArticlesResponse>{
    const queryBuilder = this.articleRepository.createQueryBuilder('articles').leftJoinAndSelect('articles.author', 'author');

    if(query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}`
      });
    }

    if(query.author) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.author
        }
      });

      if(author) {
        queryBuilder.andWhere('articles.authorId = :id', {
          id: author?.id
        });
      } else {
        return { articles: [], articlesCount: 0 };
      }
    }

    if(query.limit) {
      queryBuilder.limit(query.limit);
    }

    if(query.offset) {
      queryBuilder.offset(query.limit);
    }

    
    if(query.favorited) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.favorited
        },
        relations: ['favorites']
      });

      if (!author || author.favorites.length === 0){
        return { articles: [], articlesCount: 0 };
      }

      const favoritesIds = author?.favorites.map((article) => article.id);

      queryBuilder.andWhere('articles.id IN (:...ids)', { ids: favoritesIds });
    }

    queryBuilder.orderBy('articles.created_at', 'DESC');

    const articles = await queryBuilder.getMany();
    const articlesCount = await queryBuilder.getCount();

    return await this.generateArticlesResponse(articles, articlesCount, currentUserId);
  }

  async getFeed(currentUserId: number, query: any): Promise<IArticlesResponse> {
    const follows = await this.followRepository.find({
      where: {
        followerId: currentUserId
      }
    });

    const followingIds = follows.map((user) => user.followingId);

    if(!follows.length) {
      return { articles: [], articlesCount: 0 };
    }



    const queryBuilder = this.articleRepository.createQueryBuilder('articles').leftJoinAndSelect('articles.author', 'author');
    queryBuilder.andWhere('articles.authorId IN (:...followingIds)', { followingIds });

    const articlesCount = await queryBuilder.getCount();
    const articles = await queryBuilder.getMany();


    
    if(query.limit) {
      queryBuilder.limit(query.limit);
    }

    if(query.offset) {
      queryBuilder.offset(query.offset);
    }
 
    return await this.generateArticlesResponse(articles, articlesCount, currentUserId);
  }

  async addToFavoriteArticle(currentUserId: number, slug: string): Promise<ArticleEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId
      },
      relations: ['favorites']
    });

    if (!user) {
      throw new HttpException(
        `User with ID ${currentUserId} not found`,
        HttpStatus.NOT_FOUND
      );
    }



    const currentArticle = await this.findBySlug(slug);

    const isNotFavorite = !user?.favorites.find((article) => article.slug === currentArticle.slug);
    if(isNotFavorite) {
      currentArticle.favoritesCount++;
      user?.favorites.push(currentArticle);
      await this.articleRepository.save(currentArticle);
      await this.userRepository.save(user);
    }

    return currentArticle;
  }

  async removeArticleFromFavorites(currentUserId: number, slug: string): Promise<ArticleEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId
      },
      relations: ['favorites']
    });

    if (!user) {
      throw new HttpException(
        `User with ID ${currentUserId} not found`,
        HttpStatus.NOT_FOUND
      );
    }

    const currentArticle = await this.findBySlug(slug);
    const articleIndex = user.favorites.findIndex((article) => article.slug === currentArticle.slug);

    if (articleIndex >= 0){
      currentArticle.favoritesCount--;
      user.favorites.splice(articleIndex, 1);
      await this.articleRepository.save(currentArticle);
      await this.userRepository.save(user);
    }

    return currentArticle;
  }

  generateSlug(title: string): string {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);

    return `${slugify(title, {lower: true})}-${id}`;
  }

  async generateArticleResponse(article: ArticleEntity, currentUserId: number): Promise<IArticleResponse> {
    const profile = await this.profileService.getProfile(currentUserId, article.author.username);

    let userFavoritesIds: number[] = [];
    if (currentUserId){
      const currentUser = await this.userRepository.findOne({
        where: {
          id: currentUserId
        },
        relations: ['favorites']
      });

      userFavoritesIds = currentUser ? currentUser.favorites.map((article) => article.id) : [];
    }

    return {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        created_at: article.created_at,
        updated_at: article.updated_at,
        favorites_count: article.favoritesCount,
        favorited: userFavoritesIds.includes(article.id),
        author: {
          username: profile.username,
          bio: profile.bio,
          image: profile.image,
          following: profile.following
        }
      }
    };
  }

  async generateArticlesResponse(articles: ArticleEntity[], articlesCount: number, currentUserId: number): Promise<IArticlesResponse> {

    const usernames = new Set<string>(articles.map(article => article.author.username));
    const profiles = await this.profileService.getProfilesByUsernames(currentUserId, [...usernames]);

    let userFavoritesIds: number[] = [];
    if (currentUserId){
      const currentUser = await this.userRepository.findOne({
        where: {
          id: currentUserId
        },
        relations: ['favorites']
      });

      userFavoritesIds = currentUser ? currentUser.favorites.map((article) => article.id) : [];
    }

    let articlesFormatted: ArticleType[] = [];

    articlesFormatted = articles.map((article) => {
      const profile = profiles.get(article.author.username);

      return {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        created_at: article.created_at,
        updated_at: article.updated_at,
        favorites_count: article.favoritesCount,
        favorited: userFavoritesIds.includes(article.id),
        author: {
          username: profile?.username!,
          bio: profile?.bio!,
          image: profile?.image!,
          following: profile?.following!
        }
      }
    })



    return { 
      articles: articlesFormatted,
      articlesCount: articlesCount
    };
  }
}
