import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SigninDto } from './dtos/signin.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private revokedTokens: string[] = [];

  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signinDto: SigninDto): Promise<any> {
    const { username, password } = signinDto;
    const user = await this.userService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;

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
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const user = await this.userService.createUser({ ...userData, password: hashedPassword });
    const { password: _, ...result } = user;
    return result;
  }

  async signOut(token: string): Promise<string> {
    this.revokeToken(token);

    return 'Logout successful'; // Return the success message
  }

  private revokeToken(token: string): void {
    this.revokedTokens.push(token); // Add the token to the revoked tokens list
  }

  isTokenRevoked(token: string): boolean {
    return this.revokedTokens.includes(token); // Check if the token is revoked
  }
}
