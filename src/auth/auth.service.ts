import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SigninDto } from './dtos/signin.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService ,
    private readonly jwtService: JwtService) {}

  async signIn(signinDto: SigninDto): Promise<any> {
    const { username, password: pass } = signinDto;
    const user = await this.userService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;

    const payload = { id: user.id, username: user.firstname };
    const token = await this.jwtService.signAsync(payload, {
      secret: "hello",
      expiresIn: "5m",
    })
    ;
    return token;
  }

  async register(createUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
    const user = await this.userService.createUser(createUserDto);
    const { password, ...result } = user;
    return result;
  }
}
