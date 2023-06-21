// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { UserService } from 'src/user/user.service';
// import { SigninDto } from './dtos/signin.dto';
// import { UserEntity } from 'src/user/entities/user.entity';
// import { CreateUserDto } from './dtos/create-user.dto';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthService {
//   constructor(private userService: UserService, private readonly jwtService: JwtService) {}

//   async signIn(signinDto: SigninDto): Promise<any> {
//     const { username, password: pass } = signinDto;
//     const user = await this.userService.findOne(username);
//     if (user?.password !== pass) {
//       throw new UnauthorizedException();
//     }
//     const { password, ...result } = user;

//     const payload = { id: user.id, username: user.firstname };
//     const accessToken = await this.jwtService.signAsync(payload, {
//       secret: "hello",
//       expiresIn: "5m"
//     });
//     const refreshToken = await this.jwtService.signAsync(payload, {
//       secret: "hello-world",
//       expiresIn: '7d',
//     });

//     return { accessToken, refreshToken };
//   }

//   async register(createUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
//     const user = await this.userService.createUser(createUserDto);
//     const { password, ...result } = user;
//     return result;
//   }
// }
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SigninDto } from './dtos/signin.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private revokedTokens: string[] = [];
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signinDto: SigninDto): Promise<any> {
    const { username, password: pass } = signinDto;
    const user = await this.userService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;

    const payload = { id: user.id, username: user.firstname };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: 'hello',
      expiresIn: '5m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: 'hello-world',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async register(createUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
    const user = await this.userService.createUser(createUserDto);
    const { password, ...result } = user;
    return result;
  }

  // async signOut(): Promise<void> {
  //   // As JWT tokens are stateless, there is no explicit "signout" action required
  //   // You can simply discard the token on the client side to achieve a signout effect
  //   // If you want to add some cleanup tasks, you can do so here
  // }
  async signOut(token: string): Promise<void> {
    this.revokeToken(token); // Revoke the token
    // Additional cleanup tasks or logic...
  }

  private revokeToken(token: string): void {
    this.revokedTokens.push(token); // Add the token to the revoked tokens list
  }

  isTokenRevoked(token: string): boolean {
    return this.revokedTokens.includes(token); // Check if the token is revoked
  }
}
