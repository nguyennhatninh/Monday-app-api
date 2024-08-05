import { Body, Controller, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from './dto';
import { Workspace } from '../../schemas/workspace.schema';
import { Table } from '../../schemas/table.shema';
import { ApiResult } from '../../common/decorators';

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('Workspace')
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @ApiResult(Workspace, 'workspace', 'create')
  @Post('')
  createWorkspace(@Body() dto: CreateWorkspaceDTO) {
    return this.workspaceService.createWorkspace(dto);
  }

  @ApiResult(Table, 'table', 'getMany')
  @Get(':id/tables')
  getTableTasks(@Param('id') id: string) {
    return this.workspaceService.getWorkspaceTables(id);
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
