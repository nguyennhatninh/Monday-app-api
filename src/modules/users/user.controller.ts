import { Body, Controller, Post, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterUserDTO, UpdateUserDTO } from './dto';
import { User } from '../../schemas/user.schema';
import { Workspace } from '../../schemas/workspace.schema';
import { ApiResult, Roles } from '../../decorators';
import { AuthGuard, RolesGuard } from '../../guards';
import { Role } from '../../common/enum';
import { PublicRoute } from '../../decorators/public-route.decorator';

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('User')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.USER)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PublicRoute()
  @ApiResult(User, 'user', 'create')
  @Post('')
  register(@Body() dto: RegisterUserDTO) {
    return this.userService.createUser(dto);
  }

  @Roles(Role.ADMIN)
  @ApiResult(User, 'user', 'getAll')
  @Get('all')
  getAllUser() {
    return this.userService.findAll();
  }

  @ApiResult(User, 'user', 'getOne')
  @Get('me')
  getMe(@Req() req: Request) {
    const id = req['user']._id;
    return this.userService.findById(id);
  }

  @ApiResult(Workspace, 'workspace', 'getMany')
  @Get(':id/workspaces')
  getUserWorkspaces(@Param('id') id: string) {
    return this.userService.getUserWorkspaces(id);
  }

  @ApiResult(User, 'user', 'getOne')
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @ApiResult(User, 'user', 'update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDTO) {
    return this.userService.update(id, dto);
  }
}
