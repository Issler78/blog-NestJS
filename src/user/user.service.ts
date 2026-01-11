import { CreateUserDto } from '@/user/dto/crateUser.dto';
import { UserEntity } from '@/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const newUser = new UserEntity(); // create an instance of the class User Entity (model)

    Object.assign(newUser, createUserDto); // assign values of create user dto to new user variable

    return await this.userRepository.save(newUser);
  }
}
