import { Body, Controller, Post, Res, Next } from '@nestjs/common';
import { UserService } from './user.service';
import { Response, NextFunction } from 'express';
import { InfoLoginDto } from '../../dto/user.dto';
import { DataResponse } from 'src/global/globalClass';
import { HttpMessage, HttpStatusCode } from 'src/global/globalEnum';
import { User } from 'src/interface/user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() infoLogin: InfoLoginDto, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const result = this.userService.login(infoLogin);
      res.status(HttpStatusCode.OK).json(new DataResponse<User>(result, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      next(e);
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
    }
  }
}
