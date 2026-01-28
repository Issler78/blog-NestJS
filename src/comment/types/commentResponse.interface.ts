import { IProfileResponse } from "@/profile/types/profileResponse.interface";

export interface ICommentResponse {
  comment: {
    id: number;
    created_at: Date;
    updated_at: Date;
    body: string;
    author: IProfileResponse
  };
}
