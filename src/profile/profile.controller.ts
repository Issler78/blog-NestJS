import { ProfileService } from '@/profile/profile.service';
import { IProfileResponse } from '@/profile/types/profileResponse.interface';
import { User } from '@/user/decorators/user.decorator';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(@Param('username') profileUsername: string): Promise<IProfileResponse> {
    const profile = await this.profileService.getProfile(profileUsername);

    return this.profileService.generateProfileResponse(profile);
  }
}
