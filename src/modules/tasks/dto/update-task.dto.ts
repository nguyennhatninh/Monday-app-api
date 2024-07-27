import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { StatusTask } from '../../../common/enum';

export class UpdateTaskDTO {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'The name of the task',
    example: 'Learn create interceptor'
  })
  @IsOptional()
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
  @IsOptional()
  @IsString()
  status: StatusTask;
}
