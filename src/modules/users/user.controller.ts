import { Body, Controller, Post, Res, Next, Get, UseGuards, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Response, NextFunction } from 'express';
import { InfoRegisterDto, InfoUpdatedDto } from '../../dto/user.dto';
import { DataResponse } from 'src/global/globalClass';
import { HttpMessage, HttpStatusCode, Role } from 'src/global/globalEnum';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() infoRegisterDto: InfoRegisterDto, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.create(infoRegisterDto).catch((e) => {
        throw e.message;
      });
      res.status(HttpStatusCode.OK).json(new DataResponse(user, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(e, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @Patch(':id')
  async updated(@Body() infoUpdatedDto: InfoUpdatedDto, @Param('id') id: string, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.update(id, infoUpdatedDto);
      res.status(HttpStatusCode.OK).json(new DataResponse(user, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      next(e);
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('all')
  @Roles(Role.Admin)
  async getAllUser(@Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const userArr = await this.userService.getAll();
      res.status(HttpStatusCode.OK).json(new DataResponse(userArr, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.getUser(id);
      res.status(HttpStatusCode.OK).json(new DataResponse(user, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }
}
