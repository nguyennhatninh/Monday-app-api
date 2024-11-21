import { Body, Controller, Post, Get, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WorkspaceService } from './workspace.service';
import { UpdateWorkspaceDTO } from './dto';
import { Workspace } from '../../schemas/workspace.schema';
import { Table } from '../../schemas/table.shema';
import { ApiResult } from '../../common/decorators';
import { AuthGuard } from 'src/common/guards';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Workspace')
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @ApiResult(Workspace, 'workspace', 'create')
  @Post('')
  createWorkspace(@Req() req: Request) {
    const id = req['user']._id;
    return this.workspaceService.createWorkspace(id);
  }

  @ApiResult(Table, 'table', 'getMany')
  @Get(':id/tables')
  getTableTasks(@Param('id') id: string) {
    return this.workspaceService.getWorkspaceTasks(id);
  }

  @ApiResult(Workspace, 'workspace', 'getOne')
  @Get(':id')
  getTable(@Param('id') id: string) {
    return this.workspaceService.findById(id);
  }

  @ApiResult(Workspace, 'workspace', 'update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkspaceDTO) {
    return this.workspaceService.update(id, dto);
  }

  @ApiResult(Workspace, 'workspace', 'delete')
  @Delete(':id')
  deleteWorkspace(@Param('id') id: string) {
    return this.workspaceService.deleteWorkspace(id);
  }
}
