import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { LoginException } from '../../common/exceptions/login-exception';
import { Reflector } from '@nestjs/core';
import {
  IS_AUTH_ONLY,
  IS_GUEST_ONLY,
  NEEDED_PERMISSIONS,
} from './annotation-guard';

@Injectable()
export class AuthenticadGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const guestOnly = this.reflector.getAllAndOverride<boolean>(IS_GUEST_ONLY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const authOnly = this.reflector.getAllAndOverride<boolean>(IS_AUTH_ONLY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const permissions = this.reflector.getAllAndOverride<string[]>(
      NEEDED_PERMISSIONS,
      [context.getHandler(), context.getClass()],
    );
    console.log('guest ' + guestOnly);
    console.log('auth ' + authOnly);
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    console.log('permissions ' + permissions);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    let token = this.extractTokenFromHeader(request);
    if (!token) {
      if (authOnly) {
        throw new LoginException('Usuário não autenticado');
      }
      token = '';
    } else {
      if (authOnly || permissions) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const payload = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET,
          });
          if (!payload) {
            return false;
          }
          console.log(payload);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
          request['user'] = payload;
          if (guestOnly) {
            return false;
          }
          if (permissions) {
            console.log('cargos : ');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.log(payload.userRoles);
            for (const permission of permissions) {
              console.log('fazendo a verificação do cargo ' + permission + '');
              if (
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                !payload?.userRoles.some(
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  (role) => role.roleName === permission,
                )
              ) {
                console.log('ao procurar por [' + permission + ']');
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                payload?.userRoles.forEach((role) =>
                  console.log(role.roleName),
                );
                return false;
              }
            }
          }
          return true;
        } catch {
          throw new LoginException('Token inválido');
        }
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
