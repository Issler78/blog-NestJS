import { FollowEntity } from '@/profile/follow.entity';
import { ProfileType } from '@/profile/types/profile.type';
import { IProfileResponse } from '@/profile/types/profileResponse.interface';
import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';


@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>
  ) {}

  async getProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({
      where: {
        username: profileUsername
      }
    });

    if(!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    let isFollowed = false;
    if(currentUserId) {
      const follow = await this.followRepository.findOne({
        where: {
          followerId: currentUserId,
          followingId: profile.id
        }
      });

      isFollowed = Boolean(follow); // if find, set true
    }

    return { ...profile, following: isFollowed };
  }

  async getProfilesByUsernames(currentUserId: number, usernames: string[]): Promise<Map<string, ProfileType>> {
    const users = await this.userRepository.find({
      where: {
        username: In(usernames)
      }
    });


    const follows = currentUserId ? 
    await this.followRepository.find({
      where: {
        followerId: currentUserId,
        followingId: In(users.map(user => user.id))
      }
    }) 
    : [];

    const followingIds = new Set( follows.map(follow => follow.followingId) );
    

    const profiles = new Map<string, ProfileType>();

    for(const user of users) {
      profiles.set(user.username, {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: followingIds.has(user.id)
      });
    }

    return profiles;
  }

  async followProfile(currentUserId: number, followingUsername: string): Promise<ProfileType> {
    const followingProfile = await this.userRepository.findOne({
      where: {
        username: followingUsername,
      }
    });

    if(!followingProfile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    if(currentUserId === followingProfile.id){
      throw new HttpException("You can't follow yourself", HttpStatus.BAD_REQUEST);
    }

    

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: followingProfile.id
      }
    });

    if(!follow) {
      const newFollow = new FollowEntity();
      newFollow.followerId = currentUserId;
      newFollow.followingId = followingProfile.id;
      await this.followRepository.save(newFollow);
    }

    return { ...followingProfile, following: true };
  }

  async unfollowProfile(currentUserId: number, followingUsername: string): Promise<ProfileType> {
    const followingProfile = await this.userRepository.findOne({
      where: {
        username: followingUsername,
      }
    });

    if(!followingProfile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: followingProfile.id
    });

    return { ...followingProfile, following: false };
  }

  generateProfileResponse(profile: ProfileType): IProfileResponse {
    return { 
      profile: {
        username: profile.username,
        bio: profile.bio,
        image: profile.image,
        following: profile.following
      }
    };
  }
}
