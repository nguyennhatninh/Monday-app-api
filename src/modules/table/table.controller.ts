import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CreateTableDTO, UpdateTableDTO } from './dto';
import { TableService } from './table.service';
import { Table } from '../../schemas/table.shema';
import { Task } from '../../schemas/task.schema';
import { ApiResult } from '../../common/decorators';

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('Table')
@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @ApiResult(Table, 'table', 'create')
  @Post('')
  createTable(@Body() dto: CreateTableDTO) {
    return this.tableService.createTable(dto);
  }

  @ApiResult(Task, 'task', 'getMany')
  @Get(':id/tasks')
  getTableTasks(@Param('id') id: string) {
    return this.tableService.getTableTasks(id);
  }

  @ApiResult(Table, 'table', 'getOne')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tableService.findById(id);
  }

  @ApiResult(Table, 'table', 'update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTableDTO) {
    return this.tableService.update(id, dto);
  }

  @ApiResult(Table, 'table', 'delete')
  @Delete(':id')
  deleteTable(@Param('id') id: string) {
    return this.tableService.deleteTable(id);
  }
}
