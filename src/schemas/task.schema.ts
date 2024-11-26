import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { StatusTask } from '../common/enum';
import { User } from './user.schema';

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
  @Prop({ default: Date.now() })
  date: Date;

  @Prop()
  person: User | null;

  @ApiProperty({
    name: 'status',
    type: String,
    description: 'The status of the task'
  })
  @IsNotEmpty()
  @IsString()
  @Prop({ default: StatusTask.NOT_STARTED })
  status: StatusTask;

  @ApiProperty({
    name: 'table',
    type: String,
    description: 'The table contains the task'
  })
  @IsNotEmpty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Table' })
  table: Types.ObjectId;
}

const TaskModel = SchemaFactory.createForClass(Task);

export const TaskSchema = TaskModel;
