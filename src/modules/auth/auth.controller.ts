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
  async login(@Body() infoLogin: InfoLoginDto, @Res() res, @Next() next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.login(infoLogin);
      res.json(new DataResponse<UserLoginRes>(result, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(new DataResponse<string>(e.message, HttpStatusCode.INTERNAL_SERVER_ERROR, HttpMessage.INTERNAL_SERVER_ERROR));
      next(e);
    }
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

  @Post('google')
  async googleLogin(@Body('idToken') idToken: string, @Res() res: Response) {
    try {
      const data = await this.authService.verifyGoogleToken(idToken);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }
  }
}
