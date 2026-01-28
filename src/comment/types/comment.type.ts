import { CommentEntity } from '@/comment/comment.entity';
import { ProfileType } from '@/profile/types/profile.type';

export type CommentType = Omit<CommentEntity, 'updateTimestamp' | 'author'> & {
  author: ProfileType;
};
