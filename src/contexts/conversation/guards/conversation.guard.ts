// guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JWTService } from 'src/contexts/auth/jwt.service';
import { ConversationUnauthorizedError, TokenExpiredError, TokenInvalidError, TokenNotFoundError } from '../errors/conversation.errors';
import { Reflector } from '@nestjs/core';
import {
  hasPermission,
  PERMISSIONS_METADATA_KEY,
  toMask,
} from 'src/contexts/auth/types/permission.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JWTService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );
    
    if (!token) {
      throw new TokenNotFoundError();
    }

    const payload = await this.jwtService.verifyToken(token);

    if (!payload) {
      throw new TokenInvalidError();
    }

    request.user = payload;

    if (!requiredPermissions?.length) {
      return true;
    }

    try {
      const userMask = toMask((payload as any).permissionsMask);
      const canAccess = requiredPermissions.every((permission) =>
        hasPermission(userMask, BigInt(permission)),
      );

      if (!canAccess) {
        throw new ConversationUnauthorizedError();
      }

      return true;
    } catch (error) {
      if (error instanceof ConversationUnauthorizedError) {
        throw error;
      }
      throw new TokenExpiredError();
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}