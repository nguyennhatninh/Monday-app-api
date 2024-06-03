import { Body, Controller, Post, HttpCode, HttpStatus, Res, Next, Get, Query } from '@nestjs/common';
import { HttpMessage, HttpStatusCode } from 'src/global/globalEnum';
import { DataResponse } from 'src/global/globalClass';
import { AuthService } from './auth.service';
import { InfoLoginDto } from 'src/dto/user.dto';
import { NextFunction, Response } from 'express';
import { UserLoginRes } from 'src/interface/user.interface';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() infoLogin: InfoLoginDto, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.login(infoLogin);
      res.json(new DataResponse<UserLoginRes>(result, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      next(e);
      res.json(new DataResponse<UserLoginRes>(null, HttpStatusCode.INTERNAL_SERVER_ERROR, HttpMessage.INTERNAL_SERVER_ERROR));
    }
  }
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    try {
      const { email } = await this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      await this.userService.verifyEmail(email);
      return res.sendFile(join(__dirname, '..', 'public', 'verify-email-success.html'));
    } catch (error) {
      return res.status(400).send('Invalid or expired token');
    }
  }
}
