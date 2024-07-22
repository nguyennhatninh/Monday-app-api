import { Body, Controller, Delete, Get, Next, Param, Patch, Post, Res } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { TableService } from './table.service';
import { HttpMessage, HttpStatusCode } from '../../global/globalEnum';
import { DataResponse } from '../../global/globalClass';
import { Table } from '../../schemas/table.shema';
import { Task } from '../../schemas/task.schema';
import { InfoCreateTableDto, InfoUpdateTableDto } from './dto/table.dto';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post('add')
  async createTable(@Body() infoCreateTableDto: InfoCreateTableDto, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const table: Table = await this.tableService.createTable(infoCreateTableDto);
      res.status(HttpStatusCode.OK).json(new DataResponse(table, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @Patch(':id')
  async updateTable(
    @Param('id') id: string,
    @Body() infoUpdateTableDto: InfoUpdateTableDto,
    @Res() res: Response,
    @Next() next: NextFunction
  ): Promise<void> {
    try {
      const table: Table = await this.tableService.updateTable(id, infoUpdateTableDto);
      res.status(HttpStatusCode.OK).json(new DataResponse(table, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }
  @Get(':id')
  async getTable(@Param('id') id: string, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const table: Table = await this.tableService.getTable(id);
      res.status(HttpStatusCode.OK).json(new DataResponse(table, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @Delete(':id')
  async deleteTable(@Param('id') id: string, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      await this.tableService.deleteTable(id);
      res.status(HttpStatusCode.OK).json(new DataResponse({}, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @Get(':id/tasks')
  async getTableTasks(@Param('id') id: string, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const tasks: Task[] = await this.tableService.getTableTasks(id);
      res.status(HttpStatusCode.OK).json(new DataResponse(tasks, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }
}
