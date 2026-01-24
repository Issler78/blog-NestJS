import { ProfileService } from '@/profile/profile.service';
import { IProfileResponse } from '@/profile/types/profileResponse.interface';
import { User } from '@/user/decorators/user.decorator';
import { AuthGuard } from '@/user/guards/auth.guard';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(@Param('username') profileUsername: string): Promise<IProfileResponse> {
    const profile = await this.profileService.getProfile(profileUsername);

    return this.profileService.generateProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(@User('id') currentUserId: number, @Param('username') followingUsername: string): Promise<IProfileResponse> {
    const newFollow = await this.profileService.followProfile(currentUserId, followingUsername);

    return this.profileService.generateProfileResponse(newFollow);
  }
}
