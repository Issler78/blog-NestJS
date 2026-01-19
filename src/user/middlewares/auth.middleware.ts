import { AuthRequest } from '@/types/expressRequest.interface';
import { UserService } from '@/user/user.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction } from 'express';
import { UserEntity } from '@/user/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = new UserEntity();
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1]; // ['Token', 'awdasdawdad.asdasdwad...']

    try {
      const decode = verify(token, process.env.JWT_SECRET);
      const user = await this.userService.findById(decode.id);

      req.user = user;
      next();
    } catch (err) {
      req.user = new UserEntity();
      next();
    }
  }
}
