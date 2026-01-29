import { CommentEntity } from '@/comment/comment.entity';
import { ProfileType } from '@/profile/types/profile.type';

export type CommentType = {
  id: number,
  body: string,
  created_at: Date,
  updated_at: Date,
  author: ProfileType;
};
