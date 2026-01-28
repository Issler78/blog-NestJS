import { CommentService } from '@/comment/comment.service';
import { createCommentDto } from '@/comment/dto/createComment.dto';
import { User } from '@/user/decorators/user.decorator';
import { AuthGuard } from '@/user/guards/auth.guard';
import { UserEntity } from '@/user/user.entity';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('articles')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':slug/comments')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createComment(@Param('slug') currentArticleSlug: string, @User() currentUser: UserEntity, @Body('comment') createCommentDto: createCommentDto) {
    const newComment = await this.commentService.createComment(currentArticleSlug, currentUser, createCommentDto);
    return this.commentService.generateCommentResponse(newComment, currentUser.id);
  }

  @Delete(':slug/comments/:id')
  @UseGuards(AuthGuard)
  async deleteComment(@User('id') currentUserId: number, @Param('id') commentId: number){
    return await this.commentService.deleteComment(currentUserId, commentId);
  }
}
