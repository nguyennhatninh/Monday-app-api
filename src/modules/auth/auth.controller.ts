import { join } from 'path';
import { Response } from 'express';
import { Body, Controller, Post, Res, Get, Query, Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ForgotPassDTO, GoogleTokenDTO, LoginDTO, LoginResDTO } from './dto';
import { NewPassWordDTO } from './dto/newPass.dto';
import { UserService } from '../users/user.service';
import { ApiResult } from '../../decorators';

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  @ApiResult(LoginResDTO, 'loginRes', 'getOne')
  @Post('login')
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    try {
      const { email } = await this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      await this.userService.verifyEmail(email);
      return res.sendFile(join(process.cwd(), 'public', 'verify-email-success.html'));
    } catch (error) {
      return res.status(400).send('Invalid or expired token');
    }
  }
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPassDTO) {
    return this.authService.sendResetLink(dto.email);
  }

  @Post('reset-password/:token')
  resetPassword(@Param('token') token: string, @Body() dto: NewPassWordDTO) {
    return this.authService.resetPassword(token, dto.password);
  }

  @ApiResult(LoginResDTO, 'loginRes', 'getOne')
  @Post('login-google')
  async googleLogin(@Body() dto: GoogleTokenDTO) {
    const data = await this.authService.verifyGoogleToken(dto.idToken);
    return data;
  }
}
