import { Body, Controller, Post, Res, Next, Get, Param, Patch, Delete } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { WorkspaceService } from './workspace.service';
import { InfoCreateWorkspaceDto, InfoUpdateWorkspaceDto } from './dto/workspace.dto';
import { HttpMessage, HttpStatusCode } from '../../global/globalEnum';
import { DataResponse } from '../../global/globalClass';
import { Workspace } from '../../schemas/workspace.schema';
import { Table } from 'src/schemas/table.shema';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post('add')
  async createWorkspace(@Body() infoCreateWorkspaceDto: InfoCreateWorkspaceDto, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const workspace: Workspace = await this.workspaceService.createWorkspace(infoCreateWorkspaceDto);
      res.status(HttpStatusCode.OK).json(new DataResponse(workspace, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<string>(e.message, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @Patch(':id')
  async updated(
    @Body() infoUpdateWorkspaceDto: InfoUpdateWorkspaceDto,
    @Param('id') id: string,
    @Res() res: Response,
    @Next() next: NextFunction
  ): Promise<void> {
    try {
      const workspace: Workspace = await this.workspaceService.updateWorkspace(id, infoUpdateWorkspaceDto);
      res.status(HttpStatusCode.OK).json(new DataResponse(workspace, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }
  @Delete(':id')
  async deleteWorkspace(@Param('id') id: string, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      await this.workspaceService.deleteWorkspace(id);
      res.status(HttpStatusCode.OK).json(new DataResponse({}, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @Get(':id/tables')
  async getTableTasks(@Param('id') id: string, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const tables: Table[] = await this.workspaceService.getWorkspaceTables(id);
      res.status(HttpStatusCode.OK).json(new DataResponse(tables, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @Get(':id')
  async getTable(@Param('id') id: string, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const workspace: Workspace = await this.workspaceService.getWorkspace(id);
      res.status(HttpStatusCode.OK).json(new DataResponse(workspace, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }
}
