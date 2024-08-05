import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDTO, UpdateTaskDTO } from './dto';
import { Task } from '../../schemas/task.schema';
import { ApiResult } from '../../common/decorators';

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiResult(Task, 'task', 'create')
  @Post('')
  createTable(@Body() dto: CreateTaskDTO) {
    return this.taskService.createTask(dto);
  }

  @ApiResult(Task, 'task', 'getOne')
  @Get(':id')
  getTask(@Param('id') id: string) {
    return this.taskService.findById(id);
  }

  @ApiResult(Task, 'task', 'update')
  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDTO) {
    return this.taskService.update(id, dto);
  }

  @ApiResult(Task, 'task', 'delete')
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
