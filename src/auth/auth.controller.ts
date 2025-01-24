import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Query,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ----------------------------------------------------------------
  @Post('register')
  async create(@Body() body: CreateUserDto) {
    try {
      return await this.authService.createUSer(body);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------------------------------------------------
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.authService.login(user);
  }

  // ----------------------------------------------------------------
  @Post('activate')
  async activate(@Body('token') token: string) {
    try {
      return await this.authService.activateUser(token);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------------------------------------------------
  @Get('/me')
  async me(@Headers('Authorization') authorization = '') {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authorization.replace('Bearer ', '');
    const user = await this.authService.getUserFromToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  // ----------------------------------------------------------------
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    try {
      await this.authService.forgotPassword(email);
      return { message: 'Password reset email sent' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------------------------------------------------
  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('password') password: string,
  ) {
    try {
      await this.authService.resetPassword(token, password);
      return { message: 'Password has been reset successfully' };
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
