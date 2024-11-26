import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { StatusTask } from 'src/common/enum';

export enum DueDate {
  PAST_DATE = 'past_date',
  OVERDUE = 'overdue',
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  THIS_WEEK = 'this_week',
  NEXT_WEEK = 'next_week',
  THIS_MONTH = 'this_month'
}

export enum SortBy {
  NAME = 'name',
  DATE = 'date'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export class QueryWorkspaceDTO {
  @ApiPropertyOptional({
    name: 'query'
  })
  @IsOptional()
  query?: string;

  @ApiPropertyOptional({
    name: 'status',
    enum: StatusTask
  })
  @IsOptional()
  status?: StatusTask;

  @ApiPropertyOptional({
    name: 'dueDate',
    enum: DueDate
  })
  @IsOptional()
  dueDate?: DueDate;

  @ApiPropertyOptional({
    name: 'tableId'
  })
  @IsOptional()
  tableId?: string;

  @ApiPropertyOptional({
    name: 'sortBy',
    enum: SortBy
  })
  @IsOptional()
  sortBy?: SortBy;

  @ApiPropertyOptional({
    name: 'sortOrder',
    enum: SortOrder
  })
  @IsOptional()
  sortOrder?: SortOrder;
}
