import { Body, Controller, Post, Res, Next, Get, UseGuards, Param, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Response, NextFunction } from 'express';
import { InfoRegisterDto, InfoUpdatedDto } from './dto/user.dto';
import { DataResponse } from '../../global/globalClass';
import { HttpMessage, HttpStatusCode, Role } from '../../global/globalEnum';
import { AuthGuard } from '../../guards/jwt-auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { User } from '../../schemas/user.schema';
import { Workspace } from '../../schemas/workspace.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() infoRegisterDto: InfoRegisterDto, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const user: User = await this.userService.create(infoRegisterDto);
      res.status(HttpStatusCode.OK).json(new DataResponse(user, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<string>(e.message, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('all')
  @Roles(Role.ADMIN)
  async getAllUser(@Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const userArr: User[] = await this.userService.getAll();
      res.status(HttpStatusCode.OK).json(new DataResponse(userArr, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    const id = req['user'].id;
    try {
      const user: User = await this.userService.getUser(id);
      res.status(HttpStatusCode.OK).json(new DataResponse(user, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @Get(':id/workspaces')
  async getUserWorkspaces(@Param('id') id: string, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const workspace: Workspace[] = await this.userService.getUserWorkspaces(id);
      res.status(HttpStatusCode.OK).json(new DataResponse(workspace, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const user: User = await this.userService.getUser(id);
      res.status(HttpStatusCode.OK).json(new DataResponse(user, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }
  @Patch(':id')
  async updated(@Body() infoUpdatedDto: InfoUpdatedDto, @Param('id') id: string, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const user: User = await this.userService.update(id, infoUpdatedDto);
      res.status(HttpStatusCode.OK).json(new DataResponse(user, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }
}
