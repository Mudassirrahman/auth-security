import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/signin.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthGuard, Public } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signinDto: SigninDto): Promise<any> {
    return this.authService.signIn(signinDto);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() CreateUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
    return this.authService.register(CreateUserDto);
  }

 // @UseGuards(AuthGuard)
  // @Public()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // @Public()
  // @UseGuards(AuthGuard)
  // @HttpCode(HttpStatus.OK)
  // @Post('logout')
  // signOut(@Request() req): Promise<void> {
  //   const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
  //   return this.authService.signOut(token);
  // }
  
  @Public()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async signOut(@Request() req): Promise<string> {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
    const message = await this.authService.signOut(token);
    return message; // Return the success message
  }
}
