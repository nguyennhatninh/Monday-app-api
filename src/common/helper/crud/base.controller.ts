import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BaseService } from './base.service';
export class BaseController<Model, CreateDTO, UpdateDTO> {
  constructor(protected readonly baseService: BaseService<Model, CreateDTO, UpdateDTO>) {}

  @Get()
  findAll() {
    return this.baseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.baseService.findById(id);
  }

  @Post()
  createOne(@Body() dto: CreateDTO) {
    return this.baseService.create(dto);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() dto: UpdateDTO) {
    return this.baseService.update(id, dto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.baseService.delete(id);
  }
}
