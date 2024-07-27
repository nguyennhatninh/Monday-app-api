import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { StatusTask } from '../common/enum';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'The name of the task'
  })
  @IsNotEmpty()
  @IsString()
  @Prop()
  name: string;

  @ApiProperty({
    name: 'date',
    type: Date,
    description: 'Deadline of the task'
  })
  @IsOptional()
  @Prop({ default: undefined })
  date: Date;

  @ApiProperty({
    name: 'status',
    type: String,
    description: 'The status of the task'
  })
  @IsNotEmpty()
  @IsString()
  @Prop({ default: StatusTask.NOTSTARTED })
  status: StatusTask;

  @ApiProperty({
    name: 'table',
    type: String,
    description: 'The table contains the task'
  })
  @IsNotEmpty()
  @Prop({ type: Types.ObjectId, ref: 'Table' })
  table: Types.ObjectId;

  @ApiProperty({
    name: 'created_at',
    type: Date,
    description: 'The time task is created'
  })
  @IsNotEmpty()
  @IsDate()
  @Prop({ default: Date.now })
  created_at: Date;

  @ApiProperty({
    name: 'updated_at',
    type: Date,
    description: 'The time task is updated'
  })
  @IsNotEmpty()
  @IsDate()
  @Prop({ default: Date.now })
  updated_at: Date;
}

const TaskModel = SchemaFactory.createForClass(Task);

export const TaskSchema = TaskModel;
