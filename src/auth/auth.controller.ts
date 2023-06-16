import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/signin.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signinDto: SigninDto): Promise<Partial<UserEntity>> {
      return this.authService.signIn(signinDto);
    }
    @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() CreateUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
    return this.authService.register(CreateUserDto);
  }
}
