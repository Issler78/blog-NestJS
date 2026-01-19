import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user;

    if (!user) {
      return null;
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
