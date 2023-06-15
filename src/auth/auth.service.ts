import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SigninDto } from './dtos/signin.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async signIn(signinDto: SigninDto): Promise<Partial<UserEntity>> {
      const {username, password: pass} = signinDto
      const user = await this.userService.findOne(username);
      if (user?.password !== pass) {
        throw new UnauthorizedException();
      }
      const { password, ...result } = user;
      return result;
    }
}
