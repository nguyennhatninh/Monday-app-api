import { Body, Controller, Delete, Get, Next, Param, Patch, Post, Res } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { TaskService } from './task.service';
import { HttpMessage, HttpStatusCode } from '../../global/globalEnum';
import { DataResponse } from '../../global/globalClass';
import { Task } from '../../schemas/task.schema';
import { InfoCreateTaskDto, InfoUpdateTaskDto } from './dto/task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('add')
  async createTask(@Body() infoCreateTaskDto: InfoCreateTaskDto, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const task: Task = await this.taskService.createTask(infoCreateTaskDto);
      res.status(HttpStatusCode.OK).json(new DataResponse(task, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() infoUpdateTaskDto: InfoUpdateTaskDto,
    @Res() res: Response,
    @Next() next: NextFunction
  ): Promise<void> {
    try {
      const task: Task = await this.taskService.updateTask(id, infoUpdateTaskDto);
      res.status(HttpStatusCode.OK).json(new DataResponse(task, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }
  @Get(':id')
  async getTask(@Param('id') id: string, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      const task: Task = await this.taskService.getTask(id);
      res.status(HttpStatusCode.OK).json(new DataResponse(task, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    try {
      await this.taskService.deleteTask(id);
      res.status(HttpStatusCode.OK).json(new DataResponse({}, HttpStatusCode.OK, HttpMessage.SUCCESS));
    } catch (e) {
      res.json(new DataResponse<null>(null, HttpStatusCode.NOT_FOUND, HttpMessage.NOT_FOUND));
      next(e);
    }
  }
}
