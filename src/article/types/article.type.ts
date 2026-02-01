import { ProfileType } from "@/profile/types/profile.type";

export type ArticleType = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  created_at: Date;
  updated_at: Date;
  favorites_count: number;
  favorited: boolean;
  author: ProfileType;
};
