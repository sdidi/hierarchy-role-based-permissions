import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// This decorator will extract the user from the request object.
export const GetCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // user comes from JwtAuthGuard
  },
);
