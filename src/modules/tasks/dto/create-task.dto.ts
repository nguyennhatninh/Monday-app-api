import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusTask } from '../../../common/enum';

export class CreateTaskDTO {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'The name of the task',
    example: 'Learn create interceptor'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    name: 'date',
    type: Date,
    description: 'Deadline of the task'
  })
  @IsOptional()
  date: Date;

  @ApiProperty({
    name: 'status',
    type: String,
    description: 'The status of the task',
    example: 'Not Started'
  })
  @IsNotEmpty()
  @IsString()
  status: StatusTask;

  @ApiProperty({
    name: 'table',
    type: String,
    description: 'The table contains the task',
    example: '667a90878a27ed80df112617'
  })
  @IsNotEmpty()
  table: string;
}
