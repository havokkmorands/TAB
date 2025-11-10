import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/user/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginException } from '../common/exceptions/login-exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.retrieveByEmail(email);
    if (!(await bcrypt.compare(password, user.password ?? ''))) {
      throw new LoginException('Senha incorreta');
    }
    const payload = { ...(await this.userService.findById(user.id ?? '')) };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
